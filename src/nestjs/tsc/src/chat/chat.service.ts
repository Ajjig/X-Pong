import { Injectable } from '@nestjs/common';
import {
  CreateChatDto,
  CreatePrivateChannelDto,
  CreatePublicChannelDto,
  DirectMessageDto,
} from './dto/create-chat.dto';
import { PrismaService } from '../prisma.service';
import { Server, Socket } from 'socket.io';
import { PrivateChannel, PrivateMessage } from './entities/chat.entity';
import { connected } from 'process';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  checkpayload(data: CreatePrivateChannelDto): string {
    if (!data) {
      return 'You must provide a payload';
    }

    if (!data.user1 || !data.user2) {
      return 'You must provide a user1 and user2';
    }

    // check for payload validity
    if (data.user1 === data.user2) {
      return "You can't send a message to yourself";
    }
    return 'ok';
  }

  async checkUserExsting(data: CreatePrivateChannelDto): Promise<boolean> {
    const user1 = await this.prisma.user.findUnique({
      where: { username: data.user1 },
    });
    const user2 = await this.prisma.user.findUnique({
      where: { username: data.user2 },
    });
    if (!user1 || !user2) {
      return false;
    }
    return true;
  }

  async checkChannelExsting(data: CreatePrivateChannelDto): Promise<boolean> {
    const NewChannelId = this.makePrivateChannelId(data);

    const user = await this.prisma.user.findUnique({
      where: { username: data.user1 },
    });

    let check: boolean = false;

    user.privateChannels.forEach((channel) => {
      if (channel === NewChannelId) {
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

  async checkSingleChannelExsting(
    username: string,
    channelId: string,
  ): Promise<boolean> {
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

  makePrivateChannelId(data: CreatePrivateChannelDto): string {
    const id = `__private__${data.user1}__${data.user2}`;
    return id;
  }

  async getusersocketid(username: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user.socketId;
  }

  async setusersocketid(username: string, socketId: string): Promise<void> {
    const user = await this.prisma.user.update({
      where: { username: username },
      data: { socketId: socketId },
    });
  }

  async createprivatechannel(
    data: CreatePrivateChannelDto,
    Server: Server,
  ): Promise<string> {
    const NewChannelId = this.makePrivateChannelId(data);
    const createnewchanneluser1 = await this.prisma.user.update({
      where: {
        username: data.user1,
      },
      data: {
        // append the new channel to the user's list of channels String[]
        privateChannels: {
          push: NewChannelId,
        },
      },
    });

    const createnewchanneluser2 = await this.prisma.user.update({
      where: {
        username: data.user2,
      },
      data: {
        // append the new channel to the user's list of channels String[]
        privateChannels: {
          push: NewChannelId,
        },
      },
    });
    Server.to(data.user1).to(data.user2).emit('channelId', NewChannelId);
    return NewChannelId;
  }

  async saveprivatechatmessage(payload: DirectMessageDto): Promise<void> {
    
    const message = await this.prisma.directMessage.create({
      data: {
        text: payload.msg,
        SenderUsername: payload.sender,
        ReceiverUsername: payload.receiver,
        privateChannelId: payload.PrivateChannelId,
        sender: {
          connect: {
            username: payload.sender,
          },
        },
        receiver: {
          connect: {
            username: payload.receiver,
          },
        },
      },
    });
  }

      
}
