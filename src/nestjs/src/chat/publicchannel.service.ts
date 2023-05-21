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
import { check } from 'prettier';

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
    payload: PublicChannelMessageDto,
  ): Promise<void> {
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

  async limitFlagedUsers(channel: string, username: string): Promise<boolean> {
    // check if the user is flagged as banned or muted or kicked

    const checkuser = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        bannedFrom: true,
        mutedFrom: true,
        kickedFrom: true,
      },
    });

    if (
      checkuser.kickedFrom.length == 0 &&
      checkuser.mutedFrom.length == 0 &&
      checkuser.bannedFrom.length == 0
    ) {
      return false;
    }

    // iterate over the array of banned users and check if the user is banned from the channel

    for (let i = 0; i < checkuser.mutedFrom.length; i++) {
      if (checkuser.mutedFrom[i].name == channel) {
        console.log('user is banned from the channel');
        return true;
      }
    }

    for (let i = 0; i < checkuser.bannedFrom.length; i++) {
      if (checkuser.bannedFrom[i].name == channel) {
        console.log('user is banned from the channel');
        return true;
      }
    }

    for (let i = 0; i < checkuser.kickedFrom.length; i++) {
      if (checkuser.kickedFrom[i].name == channel) {
        console.log('user is banned from the channel');
        return true;
      }
    }

    return false;
  }

  async latestchannels(username : string) : Promise<any>
  {
    // filter the channels that the user is a member of

    const lastestchannels = await this.prisma.channel.findMany({
      where: { owner: { not : username} },
      select :
      {
        name : true,
        createdAt : true,
        owner : true,
        isPublic : true,
      },
    });

    return lastestchannels;

  }
}
