import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Console } from 'console';
import { AnyMessage } from './entities/chat.entity';

@Injectable()
export class UserChatHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPrivateConversationChatHistory(
    username: string,
    page: number,
  ): Promise<any> {
    // get user private direct messages to other users, no duplicates allowed , show only the last message

    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });

    let userConversations = [];
    if (!user) {
      return userConversations;
    }

    await Promise.all(
      user.privateChannels.map(async (id) => {
        let chat = await this.prisma.directMessage.findMany({
          where: { privateChannelId: id },
          orderBy: { createdAt: 'asc' },
          skip: page * 50,
          select: {
            text: true,
            createdAt: true,
            senderId: true,
            receiverId: true,
          },
        });
        let ids = null;
        try {
          ids = id.split('@')[1].split('+');
        } catch {
          return;
        }

        if (ids.length != 2) {
          return;
        }

        const otherUserId: number =
          parseInt(ids[0]) == user.id ? parseInt(ids[1]) : parseInt(ids[0]);
        const otherUser = await this.prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            username: true,
            id: true,
            avatarUrl: true,
            name: true,
            onlineStatus: true,
            privateChannels: true,
          },
        });
        const conv = { chat, otherUser, privateChannelId: id };
        userConversations.push(conv);
      }),
    );

    return userConversations.map((conv) => {
      return {
        chat: conv.chat.map((message) => {
          return {
            content: message.text,
            createdAt: message.createdAt,
            senderId: message.senderId,
            receiverId: message.receiverId,
          };
        }),
        otherUser: {
          username: conv.otherUser.username,
          id: conv.otherUser.id,
          avatarUrl: conv.otherUser.avatarUrl,
          name: conv.otherUser.name,
          onlineStatus: conv.otherUser.onlineStatus,
          privateChannels: conv.otherUser.privateChannels,
        },
        privateChannelId: conv.privateChannelId,
      };
    });
  }

  async getUserChannelConversationChatHistory(
    username: string,
    page: number,
  ): Promise<any> {
    let response: AnyMessage[] = [];
    const channels = await this.prisma.channel.findMany({
      where: {
        members: {
          some: {
            username: username,
          },
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        owner: true,
        createdAt: true,
        messages: {
          select: {
            content: true,
            createdAt: true,
            senderId: true,
            senderAvatarUrl: true,
            channelId: true,
          },
          orderBy: { createdAt: 'asc' },
          // skip: page * 50
        },
      },
    });

    return channels.map((channel) => {
      return {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        owner: channel.owner,
        createdAt: channel.createdAt,
        messages: channel.messages.map((message) => {
          return {
            content: message.content,
            createdAt: message.createdAt,
            senderId: message.senderId,
            avatarUrl: message.senderAvatarUrl,
            channelId: message.channelId,
          };
        }),
      };
    });
  }
}
