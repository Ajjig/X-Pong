import { channel } from 'diagnostics_channel';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import {
  CreateChatDto,
  CreatePrivateChannelDto,
  JoinPublicChannelDto,
  PrivateMessageDto,
  PublicChannelMessageDto,
  GetPrivateConversationsDto,
} from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { joinPrivateChannel } from './entities/chat.entity';
import { PublicChannelService } from './publicchannel.service';
import { UserChatHistoryService } from './user.chat.history.service';
import { Logger } from '@nestjs/common';
import { emit } from 'process';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway {
  connectedUsers: Map<string, any>;
  constructor(
    private readonly chatService: ChatService,
    private readonly publicChannelService: PublicChannelService,
    private readonly userChatHistoryService: UserChatHistoryService,
  ) {
    this.connectedUsers = new Map();
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message') // send a message to a Private channel
  async PrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PrivateMessageDto,
  ) {
    const userdata = await this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'User not found');
      return;
    }
    if (!payload || !userdata.username || !payload.msg || !payload.receiver) {
      client.emit('error', 'You must provide a payload');
      return;
    }
    const channelID = await this.chatService.makePrivateChannelId(
      userdata.username,
      payload.receiver,
    );

    if (!channelID) {
      client.emit('error', 'Payload is not valid');
      return;
    }

    const channelcheck = await this.chatService.checkSingleChannelExsting(
      userdata.username,
      channelID,
    );
    if (!channelcheck) {
      await this.chatService.createprivatechannel(
        userdata.username,
        payload.receiver,
        this.server,
        channelID,
      );
    }

    //--------------- add blocked logic here
    const blocked = await this.chatService.checkUserIsBlocked(
      userdata.username,
      payload.receiver,
    );
    if (blocked) {
      client.emit('error', 'You are blocked from this user');
      return;
    }
    //------------- add blocked logic here

    // --------------JOIN LOGIC

    // check if the user is not in the channel
    const inChannel = client.rooms.has(channelID);
    if (!inChannel) {
      client.join(channelID);
      client.to(channelID).emit('privateJoined', userdata.username);
    }
    // ---------------JOIN LOGIC

    const message = await this.chatService.saveprivatechatmessage({
      msg: payload.msg,
      sender: userdata.username,
      PrivateChannelId: channelID,
      receiver: payload.receiver,
    });
    // add created at and updated at to the message
    message.createdAt = new Date();
    message.updatedAt = new Date();

    // send the message to the channel

    client.to(channelID).emit('message', message);
  }

  // @SubscribeMessage('findAllMessages')
  // async findALLmessages(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: any,
  // ) {
  //   const userdata = await this.chatService.jwtdecoder(client);
  //   if (!userdata) {
  //     client.emit('error', 'User not found');
  //     return;
  //   }
  //   if (!payload || !payload.channelId || !userdata.username) {
  //     client.emit('error', 'You must provide a payload');
  //     return;
  //   }
  //   const channel = await this.chatService.checkSingleChannelExsting(
  //     userdata.username,
  //     payload.channelId,
  //   );
  //   if (!channel) {
  //     client.emit(
  //       'error',
  //       'You are not authorized to send messages to this channel',
  //     );
  //     return;
  //   }
  //   const messages = await this.chatService.findAllPrivateMessagesByChannelID(
  //     payload.channelId,
  //   );
  //   client.emit('findAllMessages', messages);
  // }

  // @SubscribeMessage('joinChannelPublic')
  // async joinChannelPublic(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: JoinPublicChannelDto,
  // ) {
  //   const userdata = await this.chatService.jwtdecoder(client);
  //   if (!userdata) {
  //     client.emit('error', 'User not found');
  //     return;
  //   }
  //   if (!payload || !userdata.username || !payload.channelName) {
  //     client.emit('error', 'You must provide a payload');
  //     return;
  //   }

  //   if (
  //     !(await this.publicChannelService.checkSingleUserExsting(
  //       userdata.username,
  //     ))
  //   ) {
  //     client.emit('error', 'User not found');
  //     return;
  //   }

  //   if (
  //     !(await this.publicChannelService.checkSingleChannelExsting(
  //       payload.channelName,
  //     ))
  //   ) {
  //     client.emit('error', 'Channel not found');
  //     return;
  //   }

  //   if (
  //     !(await this.publicChannelService.checkUsermemberofChannel(
  //       userdata.username,
  //       payload.channelName,
  //     ))
  //   ) {
  //     client.emit('error', 'You are not authorized to join this channel');
  //     return;
  //   }

  //   // check if the user is already in the channel
  //   const inChannel = client.rooms.has(payload.channelName);
  //   if (inChannel) {
  //     client.emit('error', 'You have already joined the channel');
  //     return;
  //   }

  //   // join the user to the channel
  //   client.join(payload.channelName);

  //   // notify the user that he joined the channel
  //   client.to(payload.channelName).emit('publicJoined', userdata.username);
  // }

  @SubscribeMessage('PublicMessage') // send a message to a Public channel
  async PublicMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const userdata = await this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'User not found');
      return;
    }
    if (
      !payload ||
      !payload.channelName ||
      !userdata.username ||
      !payload.msg
    ) {
      client.emit('error', 'You must provide a payload');
      return;
    }

    const flaggedUsersCheck = await this.publicChannelService.limitFlagedUsers(
      payload.channelName,
      userdata.username,
    );
    if (flaggedUsersCheck) {
      client.emit(
        'error',
        'You are not authorized to send messages to this channel',
      );
      return;
    }
    // check if the user has joined the channel
    const inChannel = client.rooms.has(payload.channelName);
    if (!inChannel) {
      client.join(payload.channelName);
    }
    await this.publicChannelService.saveprivatechatmessage(payload); // missnamed but is for public channel
    // add created at and updated at

    payload.createdAt = new Date();
    payload.updatedAt = new Date();
    client.to(payload.channelName).emit('PublicMessage', payload);
  }

  @SubscribeMessage('search')
  async SearchQuery(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    if (!payload || !payload.query) {
      client.emit('error', 'You must provide a payload');
      return;
    }
    const result = await this.chatService.searchQuery(payload.query);
    if (!result) {
      client.emit('error', 'No result found');
      return;
    }
    client.emit('search', result);
  }

  @SubscribeMessage('reconnect')
  async reconnect(@ConnectedSocket() client: Socket) {
    let userdata: any = this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'Unauthorized user');
      client.disconnect();
      return;
    }
    const publicChat =
      await this.userChatHistoryService.getUserChannelConversationChatHistory(
        userdata.username,
        0,
      );
    const privateChat =
      await this.userChatHistoryService.getUserPrivateConversationChatHistory(
        userdata.username,
        0,
      );

    client.emit('publicChat', publicChat);
    client.emit('privateChat', privateChat);
  }

  @SubscribeMessage('getLatestChannels')
  async getlastedchannels(@ConnectedSocket() client: Socket) {
    let userdata: any = this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'Unauthorized user');
      client.disconnect();
      return;
    }

    const result = await this.publicChannelService.latestchannels(
      userdata.username,
    );

    client.emit('letestChannels', result);
  }
  // socket Connection Handler
  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    let userdata: any = this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'Unauthorized user to connect');
      client.disconnect();
      return;
    }
    await this.chatService.joinUsertohischannels(userdata.username, client);
    new Logger('Socket').log('Client connected: ' + userdata.username);
    this.connectedUsers[userdata.username] = client;
    const publicChat =
      await this.userChatHistoryService.getUserChannelConversationChatHistory(
        userdata.username,
        0,
      );
    const privateChat =
      await this.userChatHistoryService.getUserPrivateConversationChatHistory(
        userdata.username,
        0,
      );
    client.emit('privateChat', privateChat);
    client.emit('publicChat', publicChat);
    await this.chatService.set_user_online(userdata.username);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    let userdata: any = this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'Unauthorized user');
      client.disconnect();
      return;
    }
    this.connectedUsers.delete(userdata.username);
    await this.chatService.set_user_offline(userdata.username);
  }
}
