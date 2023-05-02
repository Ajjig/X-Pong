import { Injectable, ExecutionContext } from '@nestjs/common';
import {
  CreateChatDto,
  CreatePrivateChannelDto,
  DirectMessageDto,
} from './dto/create-chat.dto';
import { PrismaService } from '../prisma.service';
import { Server, Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
dotenv.config();

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) { }

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

  async checkUserExsting(
    username: string,
    data: CreatePrivateChannelDto,
  ): Promise<boolean> {
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

  async checkChannelExsting(
    username: string,
    genereatedChannelId: string,
  ): Promise<boolean> {
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

  async makePrivateChannelId(
    sender: string,
    receiver: string,
  ): Promise<string> {
    const senderID = await this.prisma.user.findUnique({
      where: { username: sender },
    });
    const receiverID = await this.prisma.user.findUnique({
      where: { username: receiver },
    });

    let genid: number = +senderID.id + +receiverID.id + 1005;

    const id = `__private__${genid}`;
    return id;
  }

  async createprivatechannel(
    username: string,
    receiver: string,
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
        username: receiver,
      },
      data: {
        // append the new channel to the user's list of channels String[]
        privateChannels: {
          push: genereatedChannelId,
        },
      },
    });
    Server.to(username).to(receiver).emit('channelId', genereatedChannelId); // remove this line
    return genereatedChannelId;
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

  async findAllPrivateMessagesByChannelID(channelId: any): Promise<any[]> {
    const messages = await this.prisma.directMessage.findMany({
      where: {
        privateChannelId: channelId,
      },
      select: {
        text: true,
        SenderUsername: true,
        ReceiverUsername: true,
        createdAt: true,
      },
    });
    return messages;
  }

  jwtdecoder(client: Socket, context?: ExecutionContext): any {
    const token = client.handshake.headers.token as string;
    if (!token) {
      return null;
    }
    try {
      const userdecoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };
      if (context) {
        context.switchToWs().getData().userId = userdecoded.id;
      }
      return userdecoded;
    } catch {
      return null;
    }
  }

  async set_user_online(username: string): Promise<void> {
    // check if user is online
    const check = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        onlineStatus: true,
      },
    });
    if (check.onlineStatus === 'online') {
      return;
    }

    const user = await this.prisma.user.update({
      where: {
        username: username,
      },
      data: {
        onlineStatus: 'online',
      },
    });
  }

  async set_user_offline(username: string): Promise<void> {
    const user = await this.prisma.user.update({
      where: {
        username: username,
      },
      data: {
        onlineStatus: 'offline',
      },
    });
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

  async SearchQuery(query: string): Promise<any[]> {
    const users = await this.prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        username: true,
        onlineStatus: true,
      },
    });

    const channels = await this.prisma.channel.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        name: true,
        id: true,
        isPublic: true,
        owner: true,
      },
    });

    if (users.length === 0 && channels.length === 0) {
      return [];
    }

    if (users.length === 0) {
      return [channels];
    }
    if (channels.length === 0) {
      return [users];
    }

    return [users, channels];
  }

  async checkUserIsBlocked(Sender: string, Receiver: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: Sender,
      },
      include: {
        Friends: true,
      },
    });

    let check: boolean = false;

    user.Friends.forEach((friend) => {
      if (friend.username === Receiver) {
        if (friend.friendshipStatus === 'blocked') {
          check = true;
        }
      }
    });
    return check;
  }
}
