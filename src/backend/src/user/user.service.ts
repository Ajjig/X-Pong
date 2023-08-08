import { get, request } from 'http';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import {
  Injectable,
  HttpException,
  HttpCode,
  NotFoundException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '.prisma/client';
import { UpdateUserProfileDto } from './dto/update.user.profile.dto';
import { join } from 'path';

export type userStatstype = {
  achievements?: string[];
  wins?: number;
  losses?: number;
  ladder?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async setProfileUsernameByusername(
    userId: number,
    new_username: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.username === new_username) {
      throw new HttpException(
        'Cannot set same username',
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkuser = await this.prisma.user.update({
      where: { id: userId },
      data: { username: new_username },
    });

    return true;
  }

  async setProfileConfirmedByUsername(username: string) {
    try {
      const user = await this.prisma.user.update({
        where: { username: username },
        data: { confirmed: true },
      });
      return user;
    } catch (e) {
      throw new HttpException(e.meta, 400);
    }
  }

  async getProfileStatsByID(userId: number) {
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Userstats: {
          select: {
            achievements: true,
            wins: true,
            losses: true,
            ladder: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        Matchs: true,
      },
    });
    
    const matchs = user.Matchs.map( async (match) => {
      match['opponentUsername'] = await this.getUserNameById(match.opponenId);
      return match;
    });

    user.Matchs = await Promise.all(matchs);

    if (!user) {
      throw new NotFoundException(`User id ${userId} not found`);
    }

    return {stats: user.Userstats, matchs: user.Matchs};
  }

  async getUserNameById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: { username: true },
    });

    return user.username;
  }

  async getUserDataByUsername(username: string, reqUsername: string) {
    const isSameUser = username === reqUsername;

    const user = await this.prisma.user.findUnique({
      where: { username: username },
      include: {
        Userstats: true,
        Matchs: true,
        Friends: isSameUser, // Send extra data if user is logged in
        channels: isSameUser,
        AdminOf: isSameUser,
      }, // add friends and ... later
    });
    if (user) {
      return user;
    }
    throw new NotFoundException(`User ${username} not found`);
  }

  async addFriendByUsername(username: string, friendUsername: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });

    const friend = await this.prisma.user.findUnique({
      where: { username: friendUsername },
    });

    if (!friend) {
      throw new HttpException('Friend not found', 400);
    }

    const existingFriendship = await this.prisma.friends.findFirst({
      where: { FriendID: friend.id },
    });
    if (existingFriendship) {
      throw new HttpException('Friend already added', 400);
    }

    const my_side = await this.prisma.friends.create({
      data: {
        user: { connect: { id: user.id } },
        FriendID: friend.id,
        requestSentByID: user.id,
        requestSentToID: friend.id,
        friend: { connect: { id: friend.id } },
      },
    });
    return my_side;
  }

  async acceptFriendRequestByUsername(
    username: string,
    friendUsername: string,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
      });
      const friend = await this.prisma.user.findUnique({
        where: { username: friendUsername },
        include: { Friends: true },
      });

      const findexist = await this.prisma.friends.findFirst({
        // check if friend exists
        where: { FriendID: friend.id },
      });
      if (!findexist) {
        return { user };
      }

      const otherside = await this.prisma.friends.updateMany({
        where: { FriendID: user.id },
        data: { friendshipStatus: 'Accepted' },
      });

      const newFriend = await this.prisma.friends.updateMany({
        where: { FriendID: friend.id },
        data: { friendshipStatus: 'Accepted' },
      });
      return newFriend;
    } catch (e) {
      throw new HttpException(e.meta, 400);
    }
  }

  async getMatchesByUsername(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
        include: { Matchs: true },
      });
      return user.Matchs;
    } catch (e) {
      throw new HttpException(e.meta, 400);
    }
  }

  async blockFriendByUsername(userId: number, friendID: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const friend = await this.prisma.user.findUnique({
      where: { id: friendID },
    });

    if (!user || !friend) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const findexist = await this.prisma.friends.findFirst({
      // check if friend exists
      where: { FriendID: friend.id },
    });
    if (!findexist) {
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }

    const otherside = await this.prisma.friends.updateMany({
      where: {
        FriendID: friendID,
        userId: user.id,
        friendshipStatus: 'Accepted',
      },
      data: { friendshipStatus: 'Blocked' },
    });
    const otherside2 = await this.prisma.friends.updateMany({
      where: {
        FriendID: user.id,
        userId: friendID,
        friendshipStatus: 'Accepted',
      },
      data: { friendshipStatus: 'Blocked' },
    });

    if (otherside.count == 0) {
      throw new HttpException(
        'You are not a friend or already blocked',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.user.updateMany({
      where: {
        id: friend.id,
      },
      data: { blockedIds: { push: user.id } },
    });
    await this.prisma.user.updateMany({
      where: {
        id: user.id,
      },
      data: { blockedIds: { push: friend.id } },
    });

    return new HttpException('User blocked', HttpStatus.OK);
  }

  async rejectFriendRequestByUsername(
    username: string,
    friendUsername: string,
  ) {
    if (username === friendUsername) {
      throw new HttpException('Cannot reject yourself', 400);
    }
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    const friend = await this.prisma.user.findUnique({
      where: { username: friendUsername },
    });
    if (!user || !friend) {
      throw new HttpException('User does not exist', 400);
    }

    const friend_request = await this.prisma.friends.deleteMany({
      where: {
        requestSentByID: friend.id,
        requestSentToID: user.id,
        friendshipStatus: 'Pending',
      },
    });

    if (friend_request.count == 0) {
      throw new HttpException('Friend request not found', 400);
    }

    const wipe_notification = await this.prisma.notification.deleteMany({
      where: {
        from: friendUsername,
        to: username,
        type: 'friendRequest',
      },
    });

    return new HttpException('Friend request rejected', 200);
  }

  async getAvatarUrlById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: { avatarUrl: true },
    });
    if (!user) throw new NotFoundException(`User id ${id} not found`);

    if (!user.avatarUrl)
      throw new NotFoundException(`User id ${id} has no avatar`);
    if (user.avatarUrl.startsWith('http'))
      return user.avatarUrl;
    if (user.avatarUrl.startsWith('/'))
      return process.env.BACKEND_URL + user.avatarUrl;
    return process.env.BACKEND_URL + '/' + user.avatarUrl;
  }

  async getFriends(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        Friends: {
          include: {
            friend: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User id not found`);
    }
    return user.Friends;
  }

  async unblockUserById(userId: number, friendID: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const friend = await this.prisma.user.findUnique({
      where: { id: friendID },
    });

    if (!user || !friend) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const findexist = await this.prisma.friends.findFirst({
      // check if friend exists
      where: { FriendID: friend.id },
    });
    if (!findexist) {
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }

    const otherside = await this.prisma.friends.updateMany({
      where: {
        FriendID: friendID,
        userId: user.id,
        friendshipStatus: 'Blocked',
      },
      data: { friendshipStatus: 'Accepted' },
    });
    const otherside2 = await this.prisma.friends.updateMany({
      where: {
        FriendID: user.id,
        userId: friendID,
        friendshipStatus: 'Blocked',
      },
      data: { friendshipStatus: 'Accepted' },
    });

    if (otherside.count == 0) {
      throw new HttpException(
        'You are not a friend or already blocked',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.user.updateMany({
      where: {
        id: friend.id,
      },
      data: {
        blockedIds: { set: friend.blockedIds.filter((id) => id !== user.id) },
      },
    });
    await this.prisma.user.updateMany({
      where: {
        id: user.id,
      },
      data: {
        blockedIds: { set: friend.blockedIds.filter((id) => id !== friend.id) },
      },
    });

    return new HttpException('User unblocked', HttpStatus.OK);
  }

  async update_user_profile(userId: number, payload: UpdateUserProfileDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User id not found`);
    }
    if (payload.avatarUrl !== null) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: payload.avatarUrl },
      });
    }
    if (payload.name !== user.name) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { name: payload.name },
      });
    }

    if (payload.username !== user.username) {
      const usernameExist = await this.prisma.user.findUnique({
        where: { username: payload.username },
      });
      if (usernameExist) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.prisma.user.update({
        where: { id: userId },
        data: { username: payload.username },
      });

      const newToken = jwt.sign(
        {
          uid: userId,
          username: payload.username,
          is2f: false,
        },
        process.env.JWT_SECRET,
      );
      res.cookie('jwt', newToken, { httpOnly: false, path: '/' });
      throw new HttpException('Username updated', HttpStatus.OK);
      
    }
    throw new HttpException('Profile updated', HttpStatus.OK);
  }
}
