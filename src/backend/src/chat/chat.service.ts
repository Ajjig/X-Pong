import { Injectable, ExecutionContext, Logger, HttpStatus } from '@nestjs/common';
import {
    CreateChatDto,
    CreatePrivateChannelDto,
    DirectMessageDto,
    notificationsDto,
    SocketResponseDto,
} from './dto/create-chat.dto';
import { PrismaService } from '../prisma.service';
import { Server, Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { notEqual } from 'assert';
import { NotEquals } from 'class-validator';
import { UpdateUserProfileDto } from 'src/user/dto/update.user.profile.dto';

dotenv.config();

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    checkpayload(username: string, data: CreatePrivateChannelDto): string {
        if (!data) {
            return 'You must provide a payload';
        }

        if (!username || !data.user2) {
            return 'You must provide a user1 and user2';
        }

        // check for payload validity
        if (username === data.user2) {
            return "You can't send a message to yourself";
        }
        return 'ok';
    }

    async setUserSocketId(socketID: string, userID: number) {
        await this.prisma.user.update({
            where: {
                id: userID,
            },
            data: {
                socketId: socketID,
            },
        });
    }

    async checkUserExsting(username: string, data: CreatePrivateChannelDto): Promise<boolean> {
        const user1 = await this.prisma.user.findUnique({
            where: { username: username },
        });
        const user2 = await this.prisma.user.findUnique({
            where: { username: data.user2 },
        });
        if (!user1 || !user2) {
            return false;
        }
        return true;
    }

    async checkChannelExsting(username: string, genereatedChannelId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { username: username },
        });

        let check: boolean = false;

        user.privateChannels.forEach((channel) => {
            if (channel === genereatedChannelId) {
                check = true;
            }
        });

        return check;
    }

    async checkSingleUserExsting(user: string): Promise<boolean> {
        const check = await this.prisma.user.findUnique({
            where: { username: user },
        });
        if (!check) {
            return false;
        }
        return true;
    }

    async checkSingleChannelExsting(username: string, channelId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { username: username },
        });
        if (!user) {
            return false;
        }
        let check: boolean = false;

        user.privateChannels.forEach((channel) => {
            if (channel === channelId) {
                check = true;
            }
        });

        return check;
    }

    async makePrivateChannelId(sender: string, receiver: number): Promise<string> {
        const senderID = await this.prisma.user.findUnique({
            where: { username: sender },
            select: { id: true },
        });
        const receiverID = await this.prisma.user.findUnique({
            where: { id: receiver },
            select: { id: true },
        });

        if (!senderID || !receiverID) {
            return null;
        }

        let genid = null;
        if (senderID.id < receiverID.id) genid = senderID.id + '+' + receiverID.id;
        else genid = receiverID.id + '+' + senderID.id;

        const id = `__private__@${genid}`;
        return id;
    }

    async createprivatechannel(
        username: string,
        receiver: number,
        Server: Server,
        genereatedChannelId: string,
    ): Promise<string> {
        await this.prisma.user.update({
            where: {
                username: username,
            },
            data: {
                // append the new channel to the user's list of channels String[]
                privateChannels: {
                    push: genereatedChannelId,
                },
            },
        });

        await this.prisma.user.update({
            where: {
                id: receiver,
            },
            data: {
                // append the new channel to the user's list of channels String[]
                privateChannels: {
                    push: genereatedChannelId,
                },
            },
        });
        // Server.to(username).to(receiver).emit('channelId', genereatedChannelId); // remove this line
        return genereatedChannelId;
    }

    async saveprivatechatmessage(payload: DirectMessageDto): Promise<any> {
        const message = await this.prisma.directMessage.create({
            data: {
                text: payload.msg,
                privateChannelId: payload.PrivateChannelId,
                sender: {
                    connect: {
                        username: payload.sender,
                    },
                },
                receiver: {
                    connect: {
                        id: payload.receiverID,
                    },
                },
            },
        });

        return message;
    }

    async findAllPrivateMessagesByChannelID(channelId: any): Promise<any[]> {
        const messages = await this.prisma.directMessage.findMany({
            where: {
                privateChannelId: channelId,
            },
            select: {
                text: true,
                createdAt: true,
                senderId: true,
            },
        });
        return messages;
    }

    async finduserbyusername(username: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { username: username },
        });
        return user;
    }

    async jwtdecoder(client: Socket, context?: ExecutionContext): Promise<any> {
        // get token in cookie if exist else in header
        let token = null;
        try {
            token = client.handshake.headers.cookie.split('=')[1];
            const userdecoded = jwt.verify(token, process.env.JWT_SECRET) as {
                uid: number;
                username: string;
                iat: number;
                exp: number;
                is2f: boolean;
            };
            if (context) {
                context.switchToWs().getData().userId = userdecoded.uid;
            }
            const usecheck = await this.finduserbyusername(userdecoded.username);
            if (!usecheck) {
                return null;
            }
            return userdecoded;
        } catch {}

        try {
            const token = client.handshake.headers.jwt as string;
            if (!token) {
                return null;
            }
            const userdecoded = jwt.verify(token, process.env.JWT_SECRET) as {
                uid: number;
                username: string;
                iat: number;
                exp: number;
                is2f: boolean;
            };
            if (context) {
                context.switchToWs().getData().userId = userdecoded.uid;
            }
            const usecheck = await this.finduserbyusername(userdecoded.username);
            if (!usecheck) {
                return null;
            }
            return userdecoded;
        } catch {
            return null;
        }
    }

    async set_user_online(userId: number): Promise<void> {
        // check if user is online
        const check = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                onlineStatus: true,
            },
        });
        if (check && check.onlineStatus === 'online') {
            return;
        }
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    onlineStatus: 'online',
                },
            });
        } catch (error) {}
    }

    async set_user_offline(userId: number): Promise<void> {
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    onlineStatus: 'offline',
                },
            });
        } catch (error) {}
    }

    async get_user_status(username: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: {
                username: username,
            },
            select: {
                onlineStatus: true,
            },
        });
        return user.onlineStatus;
    }

    async searchQuery(query: string): Promise<any[]> {
        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            select: {
                username: true,
                onlineStatus: true,
                id: true,
                avatarUrl: true,
                name: true,
            },
        });

        const channels = await this.prisma.channel.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
                type: {
                    not: 'private',
                },
            },
            select: {
                name: true,
                id: true,
                type: true,
                ownerId: true,
            },
        });

        if (users.length === 0 && channels.length === 0) {
            return [];
        }

        if (users.length === 0) {
            return channels;
        }
        if (channels.length === 0) {
            return users;
        }

        return [...users, ...channels];
    }

    async checkUserIsBlocked(Sender: string, Receiver: number): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: {
                username: Sender,
            },
            include: {
                Friends: true,
            },
        });

        const receiverOBJ = await this.prisma.user.findUnique({
            where: {
                id: Receiver,
            },
        });

        let check: boolean = false;

        user.Friends.forEach((friend) => {
            if (friend.FriendID === receiverOBJ.id) {
                if (friend.friendshipStatus === 'blocked') {
                    check = true;
                }
            }
        });
        return check;
    }

    async joinUsertohischannels(userId: number, client: Socket) {
        // find all private channels names of a user
        const privateChannels = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                privateChannels: true,
            },
        });

        // find all public channels names of a user
        const publicChannels = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                channels: true,
            },
        });

        // join user to all his private channels
        if (privateChannels)
            for (const name of privateChannels.privateChannels) {
                const inChannel = client.rooms.has(name);
                if (!inChannel) {
                    client.join(name);
                }
            }

        // join user to all his public channels
        if (publicChannels)
            for (const name of publicChannels.channels) {
                const inChannel = client.rooms.has(name.name);
                if (!inChannel) {
                    client.join(name.name);
                }
            }
    }

    async acceptFriendRequest(
        userId: number,
        friendRequest: string,
        Server: Server,
        connectedClients: Map<string, Socket>,
    ): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                Friends: true,
            },
        });
        const userClient = connectedClients.get(user.username);
        const friendClient = connectedClients.get(friendRequest);

        const friendUser = await this.prisma.user.findUnique({
            where: {
                username: friendRequest,
            },
            include: {
                Friends: true,
            },
        });

        if (!user || !friendUser) {
            return false;
        }

        // update the friendship status to accepted

        const userFriend = await this.prisma.friends.updateMany({
            where: {
                requestSentToID: user.id,
                requestSentByID: friendUser.id,
                friendshipStatus: 'Pending',
            },
            data: {
                friendshipStatus: 'Accepted',
            },
        });

        if (userFriend.count === 0) {
            if (userClient) {
                const response: SocketResponseDto = {
                    status: HttpStatus.NOT_FOUND,
                    message: 'No friend request found',
                };
                userClient.emit('accept_friend_request', response);
            }
            return undefined;
        }

        // create a new channel for the two users
        const channel = await this.makePrivateChannelId(user.username, friendUser.id);
        const check_channel = await this.checkSingleChannelExsting(user.username, channel);
        if (!check_channel) {
            await this.createprivatechannel(user.username, friendUser.id, Server, channel);
        }

        // join the two users to the channel

        if (userClient) {
            if (!userClient.rooms.has(channel)) {
                userClient.join(channel);
            }
        }

        if (friendClient) {
            if (!friendClient.rooms.has(channel)) {
                friendClient.join(channel);
            }
            // save the notification in the database
            const notification = await this.prisma.notification.create({
                data: {
                    type: 'AcceptRequest',
                    from: user.username,
                    to: friendUser.username,
                    status: 'Accepted',
                    msg: user.username + ' accepted your friend request',
                    user: { connect: { id: friendUser.id } },
                    avatarUrl: user.avatarUrl,
                    friendId: user.id,
                },
            });
            friendClient.emit('notification', notification);
        }

        const notification_to_delete = await this.prisma.notification.deleteMany({
            where: {
                type: 'friendRequest',
                from: friendRequest,
                to: user.username,
                status: 'pending',
            },
        });

        const response: SocketResponseDto = {
            status: HttpStatus.OK,
            message: 'Friend request accepted',
        };
        return response;
    }

    async addFriend(userId: number, friendUsername: string, Server: Server): Promise<any> {
        const userobject = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (userobject.username === friendUsername) {
            const response: SocketResponseDto = {
                status: HttpStatus.BAD_REQUEST,
                message: "You can't send a friend request to yourself",
            };
            this.emitToUser(Server, userobject.username, 'add_friend', response);
            return null;
        }

        const friend = await this.prisma.user.findUnique({
            where: { username: friendUsername },
        });

        if (!userobject || !friend) {
            const response: SocketResponseDto = {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };

            this.emitToUser(Server, userobject.username, 'add_friend', response);
            return null;
        }

        const existingFriendship = await this.prisma.friends.findFirst({
            where: { FriendID: friend.id, requestSentByID: userobject.id },
        });
        if (existingFriendship) {
            const response: SocketResponseDto = {
                status: HttpStatus.BAD_REQUEST,
                message: 'You already sent a friend request to this user',
            };
            this.emitToUser(Server, userobject.username, 'add_friend', response);
            return null;
        }

        const my_side = await this.prisma.friends.create({
            data: {
                user: { connect: { id: userobject.id } },
                FriendID: friend.id,
                requestSentByID: userobject.id,
                requestSentToID: friend.id,
                friend: { connect: { id: friend.id } },
            },
        });

        const friend_side = await this.prisma.friends.create({
            data: {
                user: { connect: { id: friend.id } },
                FriendID: userobject.id,
                requestSentByID: userobject.id,
                requestSentToID: friend.id,
                friend: { connect: { id: userobject.id } },
            },
        });

        let notification_SIDE = await this.prisma.notification.create({
            data: {
                type: 'friendRequest',
                from: userobject.username,
                to: friend.username,
                status: 'pending',
                msg: userobject.username + ' sent you a friend request',
                user: { connect: { id: friend.id } },
                avatarUrl: userobject.avatarUrl,
                friendId: userobject.id,
            },
        });
        this.emitToUser(Server, friendUsername, 'notification', notification_SIDE);
        const response: SocketResponseDto = {
            status: HttpStatus.CREATED,
            message: 'Friend request sent',
        };

        return response;
    }

    async loadUserNotifications(userId: number): Promise<notificationsDto[]> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                notifications: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!user) {
            return null;
        }
        const notifications: notificationsDto[] = user.notifications;
        return notifications;
    }

    async emitToUser(
        server: Server,
        username: string,
        event: string,
        data: SocketResponseDto | notificationsDto,
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (!user) {
            [];
        }
        if (user.socketId) {
            server.to(user.socketId).emit(event, data);
        }
    }
}
