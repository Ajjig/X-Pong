import { channel } from 'diagnostics_channel';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import {
    CreateChatDto,
    CreatePrivateChannelDto,
    JoinPublicChannelDto,
    PrivateMessageDto,
    PublicChannelMessageDto,
    GetPrivateConversationsDto,
    AnyMessageDto,
    PrivateMessageRequestDto,
    SavePublicChannelMessageDto,
    PublicMessageRequestDto,
    SearchQueryDto,
    AcceptFriendRequestDto,
    SocketResponseDto,
    AddFriendRequestDto,
} from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { PublicChannelService } from './publicchannel.service';
import { UserChatHistoryService } from './user.chat.history.service';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { emit } from 'process';
import { User } from '@prisma/client';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
    namespace: 'chat',
})
export class ChatGateway {
    constructor(
        private readonly chatService: ChatService,
        private readonly publicChannelService: PublicChannelService,
        private readonly userChatHistoryService: UserChatHistoryService,
    ) {}
    private connectedClients: Map<string, Socket> = new Map<string, Socket>();

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message') // send a message to a Private channel
    async PrivateMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: PrivateMessageRequestDto) {
        const userdata = await this.chatService.jwtdecoder(client);
        if (!userdata) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
            client.emit('message', response);
            return;
        }
        if (!payload || !userdata.uid || !payload.content || !payload.receiverID) {
            const response: SocketResponseDto = {
                status: HttpStatus.BAD_REQUEST,
                message: 'You must provide a payload',
            };
            client.emit('message', response);
            return;
        }
        const userobject: User = await this.publicChannelService.getUserbyid(userdata.uid);
        if (!userobject) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
            client.emit('message', response);
            return;
        }
        if (userdata.uid === payload.receiverID) {
            const response: SocketResponseDto = {
                status: HttpStatus.BAD_REQUEST,
                message: 'You cannot send a message to yourself',
            };
            client.emit('message', response);
            return;
        }

        const channelID = await this.chatService.makePrivateChannelId(userobject.username, payload.receiverID);

        if (!channelID) {
            const response: SocketResponseDto = {
                status: HttpStatus.BAD_REQUEST,
                message: 'Payload is not valid',
            };
            client.emit('message', response);
            return;
        }

        const channelcheck = await this.chatService.checkSingleChannelExsting(userobject.username, channelID);
        if (!channelcheck) {
            await this.chatService.createprivatechannel(
                userobject.username,
                payload.receiverID,
                this.server,
                channelID,
            );
        }

        //--------------- add blocked logic here
        const blocked = await this.chatService.checkUserIsBlocked(userobject.username, payload.receiverID);
        if (blocked) {
            const response: SocketResponseDto = {
                status: HttpStatus.FORBIDDEN,
                message: 'You are blocked from this user',
            };
            client.emit('message', response);

            return;
        }
        //------------- add blocked logic here

        // --------------JOIN LOGIC

        // check if the user is not in the channel
        const inChannel = client.rooms.has(channelID);
        if (!inChannel) {
            client.join(channelID);
            client.to(channelID).emit('privateJoined', userobject.username);
        }
        // ---------------JOIN LOGIC

        const message = await this.chatService.saveprivatechatmessage({
            msg: payload.content,
            sender: userobject.username,
            PrivateChannelId: channelID,
            receiverID: payload.receiverID,
        });
        // add created at and updated at to the message

        // send the message to the channel
        const user: User = await this.publicChannelService.getUserbyid(userdata.uid);
        const receiver: User = await this.publicChannelService.getUserbyid(payload.receiverID);
        let response: AnyMessageDto = {
            content: payload.content,
            avatarUrl: user.avatarUrl,
            senderUsername: user.username,
            createdAt: new Date(),
            updatedAt: new Date(),
            channelName: null,
            channelId: null,
            senderId: userdata.uid,
            senderName: userdata.name,
            receiverId: receiver.id,
            receiverName: receiver.name,
            receiverUsername: receiver.username,
            privateChannelId: channelID,
        };

        client.to(channelID).emit('message', response);
    }

    @SubscribeMessage('PublicMessage') // send a message to a Public channel
    async PublicMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: PublicMessageRequestDto) {
        const userdata = await this.chatService.jwtdecoder(client);
        if (!userdata) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
            client.emit('PublicMessage', response);
            return;
        }
        if (!payload || !payload.id || !userdata.uid || !payload.content) {
            const response: SocketResponseDto = {
                status: HttpStatus.BAD_REQUEST,
                message: 'You must provide a payload',
            };
            client.emit('PublicMessage', response);
            return;
        }

        const userobject: User = await this.publicChannelService.getUserbyid(userdata.uid);
        if (!userobject) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
            client.emit('PublicMessage', response);
            return;
        }

        const channelName = await this.publicChannelService.getChannelNameById(payload.id);
        if (!channelName) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'Channel not found',
            };
            client.emit('PublicMessage', response);
            return;
        }

        const flaggedUsersCheck = await this.publicChannelService.limitFlagedUsers(payload.id, userdata.uid);
        if (flaggedUsersCheck) {
            const response: SocketResponseDto = {
                status: HttpStatus.FORBIDDEN,
                message: 'You are not authorized to send messages to this channel',
            };
            client.emit('PublicMessage', response);
            return;
        }
        // check if the user has joined the channel
        const inChannel = client.rooms.has(channelName);
        if (!inChannel) {
            client.join(channelName);
        }
        const savePayload: SavePublicChannelMessageDto = {
            content: payload.content,
            senderId: userobject.id,
            channelId: payload.id,
            senderAvatarUrl: userobject.avatarUrl,
        };

        await this.publicChannelService.saveprivatechatmessage(savePayload); // missnamed but is for public channel

        let response: AnyMessageDto = {
            content: payload.content,
            avatarUrl: userobject.avatarUrl,
            senderUsername: userobject.username,
            createdAt: new Date(),
            updatedAt: new Date(),
            channelName: channelName,
            channelId: payload.id,
            senderId: userdata.uid,
            senderName: userdata.name,
            receiverId: null,
            receiverName: null,
            receiverUsername: null,
            privateChannelId: null,
        };
        client.to(channelName).emit('PublicMessage', response);
    }

    @SubscribeMessage('search')
    async SearchQuery(@ConnectedSocket() client: Socket, @MessageBody() payload: SearchQueryDto) {
        if (!payload || !payload.query) {
            const response: SocketResponseDto = {
                status: HttpStatus.BAD_REQUEST,
                message: 'You must provide a payload',
            };
            client.emit('search', response);
            return;
        }
        const result = await this.chatService.searchQuery(payload.query);
        if (!result) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'No result found',
            };
            client.emit('search', response);
            return;
        }
        client.emit('search', result);
    }

    @SubscribeMessage('reconnect')
    async reconnect(@ConnectedSocket() client: Socket) {
        let userdata: any = await this.chatService.jwtdecoder(client);
        if (!userdata) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
            client.emit('reconnect', response);
            client.disconnect();
            return;
        }
        await this.chatService.joinUsertohischannels(userdata.uid, client);
        this.chatService.setUserSocketId(client.id, userdata.uid);
        const publicChat = await this.userChatHistoryService.getUserChannelConversationChatHistory(
            userdata.uid,
            0,
        );
        const privateChat = await this.userChatHistoryService.getUserPrivateConversationChatHistory(
            userdata.uid,
            0,
        );

        const UserNotifications = await this.chatService.loadUserNotifications(userdata.uid);

        client.emit('publicChat', publicChat);
        client.emit('privateChat', privateChat);
        client.emit('notifications', UserNotifications);
    }

    @SubscribeMessage('getLatestChannels')
    async getlastedchannels(@ConnectedSocket() client: Socket) {
        let userdata: any = await this.chatService.jwtdecoder(client);
        if (!userdata) {
            const response: SocketResponseDto = {
                status: HttpStatus.UNAUTHORIZED,
                message: 'Unauthorized user',
            };
            client.emit('getLatestChannels', response);
            client.disconnect();
            return;
        }

        const result = await this.publicChannelService.latestchannels(userdata.uid);

        client.emit('letestChannels', result);
    }

    @SubscribeMessage('accept_friend_request')
    async acceptFriendRequest(@ConnectedSocket() client: Socket, @MessageBody() payload: AcceptFriendRequestDto) {
        console.log('accept_friend_request', payload);
        let userdata: any = await this.chatService.jwtdecoder(client);
        if (!userdata) {
            const response: SocketResponseDto = {
                status: HttpStatus.UNAUTHORIZED,
                message: 'Unauthorized user',
            };
            client.emit('accept_friend_request', response);
            client.disconnect();
            return;
        }
        if (!payload || !payload.id) {
            const response: SocketResponseDto = {
                status: HttpStatus.BAD_REQUEST,
                message: 'You must provide a payload',
            };
            client.emit('accept_friend_request', response);
            return;
        }

        const friendObject: User = await this.publicChannelService.getUserbyid(payload.id);
        if (!friendObject) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
            client.emit('accept_friend_request', response);
            return;
        }

        const result = await this.chatService.acceptFriendRequest(
            userdata.uid,
            friendObject.username,
            this.server,
            this.connectedClients,
        );
        if (result == false) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'The user or friend is not found',
            };
            client.emit('accept_friend_request', response);
            return;
        }
        client.emit('accept_friend_request', result);
    }

    @SubscribeMessage('add_friend')
    async addFriend(@ConnectedSocket() client: Socket, @MessageBody() payload: AddFriendRequestDto) {
        let userdata: any = await this.chatService.jwtdecoder(client);
        if (!userdata) {
            const response: SocketResponseDto = {
                status: HttpStatus.UNAUTHORIZED,
                message: 'Unauthorized user',
            };
            client.emit('add_friend', response);
            client.disconnect();
            return;
        }
        if (!payload || !payload.id) {
            const response: SocketResponseDto = {
                status: HttpStatus.BAD_REQUEST,
                message: 'You must provide a payload',
            };
            client.emit('add_friend', response);
            return;
        }

        const friendObject: User = await this.publicChannelService.getUserbyid(payload.id);
        if (!friendObject) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
            client.emit('add_friend', response);
            return;
        }

        const result = await this.chatService.addFriend(userdata.uid, friendObject.username, this.server);
        client.emit('add_friend', result);
    }

    // socket Connection Handler
    async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        let userdata: any = await this.chatService.jwtdecoder(client);
        if (!userdata || userdata.is2f) {
            client.emit('error', 'Unauthorized user to connect');
            client.disconnect();
            return;
        }
        this.connectedClients.set(userdata.username, client);
        // test get user client socket from using server
        await this.chatService.setUserSocketId(client.id, userdata.uid);

        await this.chatService.joinUsertohischannels(userdata.uid, client);
        new Logger('Socket').log('Client connected: ' + userdata.username);

        const publicChat = await this.userChatHistoryService.getUserChannelConversationChatHistory(
            userdata.uid, 
            0,
        );
        const privateChat = await this.userChatHistoryService.getUserPrivateConversationChatHistory(
            userdata.uid,
            0,
        );

        const UserNotifications = await this.chatService.loadUserNotifications(userdata.uid);
        client.emit('privateChat', privateChat);
        client.emit('publicChat', publicChat);
        client.emit('notifications', UserNotifications);
        await this.chatService.set_user_online(userdata.uid);
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        let userdata: any = await this.chatService.jwtdecoder(client);
        if (!userdata) {
            client.emit('error', 'Unauthorized user');
            client.disconnect();
            return;
        }
        this.chatService.setUserSocketId(null, userdata.uid);
        this.connectedClients.delete(userdata.username);
        await this.chatService.set_user_offline(userdata.uid);
    }

    emitToUser(socketID: string, event: string, payload: any) {
        if (socketID == null) {
            return;
        }
        this.server.to(socketID).emit(event, payload);
    }
}
