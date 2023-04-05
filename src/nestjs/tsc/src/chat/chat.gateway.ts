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

  @SubscribeMessage('createChannelPrivate')
  async createChannelPrivate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreatePrivateChannelDto,
  ) {
    // check for payload validity
    const userdata = await this.chatService.jwtdecoder(client);
    if (!userdata) {
      client.emit('error', 'User not found');
      return;
    }

    const check = this.chatService.checkpayload(userdata.username, payload);
    if (check !== 'ok') {
      client.emit('error', check);
      return;
    }
    const checkUserExsting = await this.chatService.checkUserExsting(
      userdata.username,
      payload,
    );
    if (!checkUserExsting) {
      client.emit('error', 'User not found');
      return;
    }
    const checkChannelExsting = await this.chatService.checkChannelExsting(
      userdata.username,
      payload,
    );
    if (checkChannelExsting) {
      client.emit(
        'channelId',
        this.chatService.makePrivateChannelId(userdata.username, payload),
      );
      return;
    }
    const NewChannelId = await this.chatService.createprivatechannel(
      userdata.username,
      payload,
      this.server,
    );
    client.emit('channelId', NewChannelId);
  }

  @SubscribeMessage('joinPrivateChannel')
  async joinPrivateChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: joinPrivateChannel,
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
    const checkUserExsting = await this.chatService.checkSingleUserExsting(
      userdata.username,
    );
    if (!checkUserExsting) {
      client.emit('error', 'User not found');
      return;
    }
    const checkChannelExsting =
      await this.chatService.checkSingleChannelExsting(
        userdata.username,
        payload.channelId,
      );
    if (!checkChannelExsting) {
      client.emit('error', 'Channel not found');
      return;
    }
    // check if the user is already in the channel
    const inChannel = client.rooms.has(payload.channelId);
    if (inChannel) {
      client.emit('error', 'You have already joined the channel');
      return;
    }
    // join the user to the channel
    client.join(payload.channelId);

    // notify the user that he joined the channel
    client.to(payload.channelId).emit('privateJoined', userdata.username);
  }

  @SubscribeMessage('PrivateMessage') // send a message to a Private channel
  async PrivateMessage(
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
      !payload.channelId ||
      !userdata.username ||
      !payload.msg ||
      !payload.receiver
    ) {
      client.emit('error', 'You must provide a payload');
      return;
    }
    const channel = this.chatService.checkSingleChannelExsting(
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
    await this.chatService.saveprivatechatmessage({
      msg: payload.msg,
      sender: userdata.username,
      PrivateChannelId: payload.channelId,
      receiver: payload.receiver,
    });
    // send the message to the channel
    client.to(payload.channelId).emit('PrivateMessage', payload.msg);
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

  @SubscribeMessage('UserStatus')
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
    client.emit('UserStatus', status);
  }

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
