import { Injectable } from '@nestjs/common';
import {
  CreateChatDto,
  CreatePrivateChannelDto,
  DirectMessageDto,
  PublicChannelMessageDto,
} from './dto/create-chat.dto';
import { PrismaService } from '../prisma.service';
import { Server, Socket } from 'socket.io';
import { PrivateChannel, PrivateMessage } from './entities/chat.entity';

@Injectable()
export class PublicChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async checkSingleUserExsting(user: string): Promise<boolean> {
    const checkuser = await this.prisma.user.findUnique({
      where: {
        username: user,
      },
    });
    if (!checkuser) {
      return false;
    }
    return true;
  }

  async checkSingleChannelExsting(channelId: string): Promise<boolean> {
    const checkchannel = await this.prisma.channel.findUnique({
      where: {
        name: channelId,
      },
    });
    if (!checkchannel) {
      return false;
    }
    return true;
  }

  async checkUsermemberofChannel(
    user: string,
    channel: string,
  ): Promise<boolean> {
    const checkusermemberofchannel = await this.prisma.user.findFirst({
      where: {
        username: user,
        channels: {
          some: {
            name: channel,
          },
        },
      },
    });
    if (!checkusermemberofchannel) {
      return false;
    }
    return true;
  }

  async saveprivatechatmessage(payload: PublicChannelMessageDto) : Promise<void>{
    const sender = await this.prisma.user.findUnique({
      where: {
        username: payload.username,
      },
    });

    const newMessage = await this.prisma.message.create({
      data: {
        content: payload.msg,
        sender: payload.username,
        senderId: sender.id,
        channel: {
          connect: {
            name: payload.channelName,
          },
        },
      },
    });

  }
}
