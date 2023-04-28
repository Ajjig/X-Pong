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
} from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { joinPrivateChannel } from './entities/chat.entity';
import { PublicChannelService } from './publicchannel.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly PublicChannelService: PublicChannelService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('PrivateMessage') // send a message to a Private channel
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

    await this.chatService.saveprivatechatmessage({
      msg: payload.msg,
      sender: userdata.username,
      PrivateChannelId: channelID,
      receiver: payload.receiver,
    });

    // send the message to the channel
    client.to(channelID).emit('PrivateMessage', payload.msg);
  }

  @SubscribeMessage('findallmessages')
  async findALLmessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const userdata = await this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'User not found');
      return;
    }
    if (!payload || !payload.channelId || !userdata.username) {
      client.emit('error', 'You must provide a payload');
      return;
    }
    const channel = await this.chatService.checkSingleChannelExsting(
      userdata.username,
      payload.channelId,
    );
    if (!channel) {
      client.emit(
        'error',
        'You are not authorized to send messages to this channel',
      );
      return;
    }
    const messages = await this.chatService.findAllPrivateMessagesByChannelID(
      payload.channelId,
    );
    client.emit('findallmessages', messages);
  }

  @SubscribeMessage('joinChannelPublic')
  async joinChannelPublic(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinPublicChannelDto,
  ) {
    const userdata = await this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'User not found');
      return;
    }
    if (!payload || !userdata.username || !payload.channelName) {
      client.emit('error', 'You must provide a payload');
      return;
    }

    if (
      !(await this.PublicChannelService.checkSingleUserExsting(
        userdata.username,
      ))
    ) {
      client.emit('error', 'User not found');
      return;
    }

    if (
      !(await this.PublicChannelService.checkSingleChannelExsting(
        payload.channelName,
      ))
    ) {
      client.emit('error', 'Channel not found');
      return;
    }

    if (
      !(await this.PublicChannelService.checkUsermemberofChannel(
        userdata.username,
        payload.channelName,
      ))
    ) {
      client.emit('error', 'You are not authorized to join this channel');
      return;
    }

    // check if the user is already in the channel
    const inChannel = client.rooms.has(payload.channelName);
    if (inChannel) {
      client.emit('error', 'You have already joined the channel');
      return;
    }

    // join the user to the channel
    client.join(payload.channelName);

    // notify the user that he joined the channel
    client.to(payload.channelName).emit('publicJoined', userdata.username);
  }

  // @SubscribeMessage('leaveChannelPublic')

  // @SubscribeMessage('joinChannelProtected')
  // async joinChannelProtected(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: any,
  // ) {
  //   const userdata = await this.chatService.jwtdecoder(client);
  //   if (!userdata) {
  //     client.emit('error', 'User not found');
  //     return;
  //   }
  //   if (
  //     !payload ||
  //     !userdata.username ||
  //     !payload.channelName ||
  //     !payload.password
  //   ) {
  //     client.emit('error', 'You must provide a payload');
  //     return;
  //   }

  //   const check_channel =
  //     await this.PublicChannelService.checkSingleChannelExsting(
  //       payload.channelName,
  //     );
  //   if (!check_channel) {
  //     client.emit('error', 'Channel not found');
  //     return;
  //   }
    
  // }

  @SubscribeMessage('PublicMessage') // send a message to a Public channel
  async PublicMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PublicChannelMessageDto,
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

    // check if the user has joined the channel
    const inChannel = client.rooms.has(payload.channelName);
    if (!inChannel) {
      client.emit('error', 'You have not joined the channel');
      return;
    }
    await this.PublicChannelService.saveprivatechatmessage(payload);
    client.to(payload.channelName).emit('PublicMessage', payload.msg);
  }

  @SubscribeMessage('UserConnectionStatus')
  async UserStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    if (!payload || !payload.username_status) {
      client.emit('error', 'You must provide a payload');
      return;
    }
    const status = await this.chatService.get_user_status(
      payload.username_status,
    );
    if (!status) {
      client.emit('error', 'User not found');
      return;
    }
    client.emit('UserConnectionStatus', status);
  }

  @SubscribeMessage('SearchQuery')
  async SearchQuery(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    if (!payload || !payload.query) {
      client.emit('error', 'You must provide a payload');
      return;
    }
    const result = await this.chatService.SearchQuery(payload.query);
    if (!result) {
      client.emit('error', 'No result found');
      return;
    }
    client.emit('SearchQuery', result);
  }

  // socket Connection Handler
  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    let userdata: any = this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'Unauthorized user');
      client.disconnect();
      return;
    }
    await this.chatService.set_user_online(userdata.username);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    let userdata: any = this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'Unauthorized user');
      client.disconnect();
      return;
    }
    await this.chatService.set_user_offline(userdata.username);
    console.log('client disconnected');
  }
}
