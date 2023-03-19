import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto, CreatePrivateChannelDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { joinPrivateChannel } from './entities/chat.entity';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtUnauthorizedFilter } from './customfilter.service';
import { JwtAuthGuardSockets } from '../auth/socket-jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(JwtUnauthorizedFilter)
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(JwtAuthGuardSockets)
  @SubscribeMessage('createChannelPrivate')
  async createChannelPrivate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreatePrivateChannelDto,
  ) {
    // check for payload validity
    const check = this.chatService.checkpayload(payload);
    if (check !== 'ok') {
      client.emit('error', check);
      return;
    }
    const checkUserExsting = await this.chatService.checkUserExsting(payload);
    if (!checkUserExsting) {
      client.emit('error', 'User not found');
      return;
    }
    const checkChannelExsting = await this.chatService.checkChannelExsting(
      payload,
    );
    if (checkChannelExsting) {
      client.emit('channelId', this.chatService.makePrivateChannelId(payload));
      return;
    }
    const NewChannelId = await this.chatService.createprivatechannel(
      payload,
      this.server,
    );
    client.emit('channelId', NewChannelId);
  }

  @UseGuards(JwtAuthGuardSockets)
  @SubscribeMessage('joinPrivateChannel')
  async joinPrivateChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: joinPrivateChannel,
  ) {
    if (!payload || !payload.channelId || !payload.user) {
      client.emit('error', 'You must provide a payload');
      return;
    }
    const checkUserExsting = await this.chatService.checkSingleUserExsting(
      payload.user,
    );
    if (!checkUserExsting) {
      client.emit('error', 'User not found');
      return;
    }
    const checkChannelExsting =
      await this.chatService.checkSingleChannelExsting(
        payload.user,
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
    client.to(payload.channelId).emit('privateJoined', payload.user);
  }

  @UseGuards(JwtAuthGuardSockets)
  @SubscribeMessage('PrivateMessage') // send a message to a Private channel
  async PrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    if (!payload || !payload.channelId || !payload.user || !payload.msg || !payload.receiver) {
      client.emit('error', 'You must provide a payload');
      return;
    }
    const channel = this.chatService.checkSingleChannelExsting(
      payload.user,
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
      sender: payload.user,
      PrivateChannelId: payload.channelId,
      receiver: payload.receiver,
    });
    // send the message to the channel
    client.to(payload.channelId).emit('PrivateMessage', payload.msg);
  }

  @UseGuards(JwtAuthGuardSockets)
  @SubscribeMessage('findallmessages')
  async findALLmessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    if (!payload || !payload.channelId || !payload.user) {
      client.emit('error', 'You must provide a payload');
      return;
    }
    const channel = await this.chatService.checkSingleChannelExsting(
      payload.user,
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
}
