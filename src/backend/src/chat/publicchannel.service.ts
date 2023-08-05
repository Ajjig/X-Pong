import { Injectable } from '@nestjs/common';
import {
  CreateChatDto,
  CreatePrivateChannelDto,
  DirectMessageDto,
  PublicChannelMessageDto,
  SavePublicChannelMessageDto,
} from './dto/create-chat.dto';
import { PrismaService } from '../prisma.service';
import { Server, Socket } from 'socket.io';
import { PrivateChannel, PrivateMessage } from './entities/chat.entity';
import { check } from 'prettier';
import { User } from '@prisma/client';

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

  async saveprivatechatmessage(
    payload: SavePublicChannelMessageDto,
  ): Promise<void> {
 

    const newMessage = await this.prisma.message.create({
      data: {
        content: payload.content,
        senderAvatarUrl : payload.senderAvatarUrl,
        user: {
          connect: {
            id: payload.senderId,
          },
        },
        channel: {
          connect: {
            id: payload.channelId,
          },
        },
      },
    });
  }

  async limitFlagedUsers(channelId: number, userId: number): Promise<boolean> {
    // check if the user is flagged as banned or muted or kicked
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        banned: true,
        kicked: true,
        muted: true,
      },
    });

    if (!channel) return true;

    if (channel.banned.some((user) => user.id === userId))
      return true;
    if (channel.kicked.some((user) => user.id === userId))
      return true;
    if (channel.muted.some((user) => user.id === userId))
      return true;

    return false;
  }

  async latestchannels(username: string): Promise<any> {
    // filter the channels that the user is a member of

    const lastestchannels = await this.prisma.channel.findMany({
      where: { owner: { not: username } },
      select: {
        name: true,
        createdAt: true,
        owner: true,
        type: true,
      },
    });

    return lastestchannels;
  }

  async getChannelNameById(channelId: number): Promise<string> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    return channel.name;
  }

  async getUserbyid(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }


  // get user by username
  async getUserbyusername(username: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    return user;
  }

}
