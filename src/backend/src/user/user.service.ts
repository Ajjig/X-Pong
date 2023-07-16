import { request } from 'http';
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
    username: string,
    new_username: string,
  ): Promise<boolean> {
    try {
      const user = await this.prisma.user.update({
        where: { username: username },
        data: { username: new_username },
      });
      return user !== null;
    } catch (e) {
      return false;
    }
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

  async setProfileStatsByUsername(username: string, stats: userStatstype) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
        include: { Userstats: true },
      });

      const oldAchievements = user.Userstats?.achievements || [];
      const updatedAchievements = [...oldAchievements, ...stats.achievements];

      const updatedUserStats = await this.prisma.userstats.update({
        where: { id: user.Userstats.id },
        data: {
          achievements: updatedAchievements,
          ladder: stats.ladder,
          wins: user.Userstats.wins + stats.wins,
          losses: user.Userstats.losses + stats.losses,
        },
      });
      return updatedUserStats;
    } catch (e) {
      console.log(e);
      throw new HttpException(e.meta, 400);
    }
  }

  async getProfileStatsByUsername(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
        include: { Userstats: true },
      });
      return user.Userstats;
    } catch (e) {
      throw new HttpException(e.meta, 400);
    }
  }

  async getUserDataByUsername(username: string, reqUsername: string) {
    const isSameUser = username === reqUsername;

    const user = await this.prisma.user.findUnique({
      where: { username: username },
      include: {
        Userstats: true,
        Matchs: isSameUser,
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
        where: { username: friend.username },
      });
      if (existingFriendship) {
        throw new HttpException('Friend already added', 400);
      }

      const my_side = await this.prisma.friends.create({
        data: {
          user: { connect: { id: user.id } },
          username: friend.username,
          requestSentBy : username,
          requestSentTo : friendUsername,
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
        where: { username: friend.username },
      });
      if (!findexist) {
        return { user };
      }

      const otherside = await this.prisma.friends.updateMany({
        where: { username: user.username },
        data: { friendshipStatus: 'Accepted' },
      });

      const newFriend = await this.prisma.friends.updateMany({
        where: { username: friend.username },
        data: { friendshipStatus: 'Accepted' },
      });
      return newFriend;
    } catch (e) {
      console.log(e);
      throw new HttpException(e.meta, 400);
    }
  }

  async saveMatchByUsername(username: string, match: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
        include: { Userstats: true },
      });

      const opp = await this.prisma.user.findUnique({
        where: { username: match.opponent },
      });

      if (!opp) {
        throw new HttpException('Opponent not found', 400);
      }

      const newMatch = await this.prisma.matchs.create({
        data: {
          user: { connect: { id: user.id } },
          result: match.result,
          opponent: match.opponent,
          map: match.map,
          mode: match.mode, // random, friendly
          opponentUser: { connect: { id: opp.id } },
        },
      });

      // if the user won the match increase his wins by 1
      if (match.result === 'Win') {
        const updatedUserStats = await this.prisma.userstats.update({
          where: { userId: user.id },
          data: { wins: user.Userstats.wins + 1 },
        });
      }
      // if the user lost the match increase his losses by 1
      if (match.result === 'Loss') {
        const updatedUserStats = await this.prisma.userstats.update({
          where: { userId: user.id },
          data: { losses: user.Userstats.losses + 1 },
        });
      }

      const LadderList: string[] = [
        'Bronze',
        'Silver',
        'Gold',
        'Platinum',
        'Diamond',
        'Master',
      ];
      const userstats = await this.prisma.userstats.findUnique({
        where: { userId: user.id },
      });
      // if the user won the match increase his ladder by ladder index list
      for (let i = 0; i < LadderList.length; i++) {
        const threshold = (i + 1) * 5; // Set the threshold for each ladder level
        if (userstats.wins >= threshold) {
          const updatedUserStats = await this.prisma.userstats.update({
            where: { userId: user.id },
            data: { ladder: LadderList[i] },
          });
        }
      }

      const winThresholds = [10, 50, 100, 500];
      const lossThresholds = [10, 50, 100, 500];

      // Check for win count achievements
      for (const threshold of winThresholds) {
        if (userstats.wins >= threshold) {
          await this.prisma.userstats.update({
            where: { userId: user.id },
            data: {
              achievements: { push: `Winning Streak: Win ${threshold} games.` },
            },
          });
        }
      }

      // Check for loss count achievements
      for (const threshold of lossThresholds) {
        if (userstats.losses >= threshold) {
          await this.prisma.userstats.update({
            where: { userId: user.id },
            data: {
              achievements: { push: `Tough Losses: Lose ${threshold} games.` },
            },
          });
        }
      }

      return userstats;
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

  async blockFriendByUsername(request: any, friendUsername: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: request.username },
      });
      const friend = await this.prisma.user.findUnique({
        where: { username: friendUsername },
      });

      if (!user || !friend)
      {
        return  new HttpException('User does not exist', 400);
      }

      const findexist = await this.prisma.friends.findFirst({
        // check if friend exists
        where: { username: friend.username },
      });
      if (!findexist) {
        throw new HttpException('Friend not found', 400);
      }

      const otherside = await this.prisma.friends.updateMany({
        where: { 
          userId : user.id,
          username : friendUsername,
          friendshipStatus : 'Accepted', 
        },
        data: { friendshipStatus: 'Blocked' },
      });

      if ( otherside.count == 0)
      {
        return new HttpException('You are not a friend or already blocked', 400);
      }

      return new HttpException('user blocked' , 200)
    } catch (e) {
      console.log(e)
      throw new HttpException(e.meta, 400);
    }
  }
}
