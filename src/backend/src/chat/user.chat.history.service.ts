import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Console } from 'console';

@Injectable()
export class UserChatHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPrivateConversationChatHistory(username: string, page: number): Promise<any> {
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
            privateChannelId: true,
            senderId: true,
            receiverId: true,
          },
        });
        let ids = null;
        try {
          ids = id.split('@')[1].split('+');
        } catch { return; }

        if (ids.length != 2) {
          return;
        }

        const otherUserId: number = parseInt(ids[0]) == user.id ? parseInt(ids[1]) : parseInt(ids[0]);
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
        const conv = { chat, otherUser };
        userConversations.push(conv);
      }),
    );

    return userConversations;
  }

  async getUserChannelConversationChatHistory(username: string, page: number): Promise<any> {
    const chat = await this.prisma.message.findMany({
      where: { sender: username },
      orderBy: { createdAt: 'asc' },
      skip: page * 50,
      select: {
        content: true,
        sender: true,
        createdAt: true,
        channel: { select: { name: true, type: true, owner: true } },
      },
    });

    return chat;
  }
}
