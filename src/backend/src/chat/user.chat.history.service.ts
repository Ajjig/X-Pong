import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Console } from 'console';
import { AnyMessage } from './entities/chat.entity';

@Injectable()
export class UserChatHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPrivateConversationChatHistory(
    userId: number,
    page: number,
  ): Promise<any> {
    // get user private direct messages to other users, no duplicates allowed , show only the last message

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        privateChannels: true,
        username: true,
        id: true,
        avatarUrl: true,
        name: true,
        onlineStatus: true,
        blockedIds: true,
      },
    });

    let userConversations = [];
    if (!user) {
      return userConversations;
    }

    const isBlocked = (otherUserId: number) => {
      return user.blockedIds.includes(otherUserId);
    };
  
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
        otherUser['isBocked'] = isBlocked(otherUserId);
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
          isBlocked: conv.otherUser.isBocked,
        },
        privateChannelId: conv.privateChannelId,
      };
    });
  }

  async getUserChannelConversationChatHistory(
    userId: number,
    page: number,
  ): Promise<any> {
    let response: AnyMessage[] = [];
    const channels = await this.prisma.channel.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        ownerId: true,
        createdAt: true,
        adminsIds: true,
        messages: {
          select: {
            content: true,
            createdAt: true,
            senderId: true,
            channelId: true,
            user : {
              select : {
                username : true,
                avatarUrl : true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return channels;


  }
}
