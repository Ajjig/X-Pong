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
import { PrismaService } from '../prisma.service';
import { joinPrivateChannel } from './entities/chat.entity';
import { channel } from 'diagnostics_channel';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createChannelPrivate')
  async createChannelPrivate(client: Socket, payload: CreatePrivateChannelDto) {
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
    await this.chatService.setusersocketid(payload.user1, client.id);
    const NewChannelId = await this.chatService.createprivatechannel(
      payload,
      this.server,
    );
    client.emit('channelId', NewChannelId);
  }

  @SubscribeMessage('joinPrivateChannel')
  async joinPrivateChannel(client: Socket, payload: joinPrivateChannel) {
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
    await this.chatService.setusersocketid(payload.user, client.id);
    // join the user to the channel
    client.join(payload.channelId);

    // notify the user that he joined the channel
    client.to(payload.channelId).emit('privateJoined', payload.user);
  }

  @SubscribeMessage('PrivateMessage') // send a message to a Private channel
  async PrivateMessage(client: Socket, payload: any) {
    if (!payload || !payload.channelId || !payload.user || !payload.msg) {
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
    await this.chatService.setusersocketid(payload.user, client.id);
    await this.chatService.saveprivatechatmessage({
      msg: payload.msg,
      sender: payload.user,
      PrivateChannelId: payload.channelId,
      receiver: payload.receiver,
    });
    // send the message to the channel
    client.to(payload.channelId).emit('PrivateMessage', payload.msg);
  }
}
