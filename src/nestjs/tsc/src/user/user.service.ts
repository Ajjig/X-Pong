import { request } from 'http';
import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma, PrismaClient } from '.prisma/client';


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

  async setProfilePictureByUsername(
    username: string,
    avatarUrl: string,
  ): Promise<HttpException> {
    try {
      const user = await this.prisma.user.update({
        where: { username: username },
        data: { avatarUrl: avatarUrl },
      });
      return new HttpException('Avatar updated', 200);
    } catch (e) {
      return new HttpException(e.meta, 400);
    }
  }

  async setProfileUsernameByusername(
    username: string,
    new_username: string,
  ): Promise<HttpException> {
    try {
      const user = await this.prisma.user.update({
        where: { username: username },
        data: { username: new_username },
      });
      return new HttpException('Username updated', 200);
    } catch (e) {
      return new HttpException(e.meta, 400);
    }
  }

  async setProfileConfirmedByUsername(
    username: string,
  ): Promise<HttpException> {
    try {
      const user = await this.prisma.user.update({
        where: { username: username },
        data: { confirmed: true },
      });
      return new HttpException('Confirmed updated', 200);
    } catch (e) {
      return new HttpException(e.meta, 400);
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
      return new HttpException('Stats updated', 200);
    } catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
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
      return new HttpException(e.meta, 400);
    }
  }

  async getUserDataByUsername(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
        include: {
          Userstats: true,
          Matchs: true,
          Friends: true,
          channels: true,
          AdminOf: true,
        }, // add friends and ... later
      });
      return user;
    } catch (e) {
      return new HttpException(e.meta, 400);
    }
  }

  async addFriendByUsername(username: string, friendUsername: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
        include: { Userstats: true },
      });

      const friend = await this.prisma.user.findUnique({
        where: { username: friendUsername },
        include: { Userstats: true },
      });

      const findexist = await this.prisma.friends.findUnique({
        // check if friend already added
        where: { username: friend.username },
      });
      if (findexist) {
        return new HttpException('Friend already added', 400);
      }

      const other_side = await this.prisma.friends.create({
        data: {
          user: { connect: { id: friend.id } },
          username: user.username,
          ladder: user.Userstats.ladder ? user.Userstats.ladder : 'Bronze',
          onlineStatus: user.onlineStatus,
        },
      });

      const newFriend = await this.prisma.friends.create({
        data: {
          user: { connect: { id: user.id } },
          username: friend.username,
          ladder: friend.Userstats.ladder ? friend.Userstats.ladder : 'Bronze',
          onlineStatus: friend.onlineStatus,
        },
      });
      return new HttpException('Friend added', 200);
    } catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
    }
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

      const findexist = await this.prisma.friends.findUnique({
        // check if friend exists
        where: { username: friend.username },
      });
      if (!findexist) {
        return new HttpException('Friend not found', 400);
      }

      const otherside = await this.prisma.friends.update({
        where: { username: user.username },
        data: { friendshipStatus: 'Accepted' },
      });

      const newFriend = await this.prisma.friends.update({
        where: { username: friend.username },
        data: { friendshipStatus: 'Accepted' },
      });
      return new HttpException('Friend added', 200);
    } catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
    }
  }

  async saveMatchByUsername(username: string, match: Prisma.MatchsCreateInput) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
      });
      const newMatch = await this.prisma.matchs.create({
        data: {
          user: { connect: { id: user.id } },
          result: match.result,
          opponent: match.opponent,
          map: match.map,
          mode: match.mode,
        },
      });
      return new HttpException('Match saved', 200);
    } catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
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
      return new HttpException(e.meta, 400);
    }
  }

  async blockFriendByUsername(request : any, 
    friendUsername: string,
    )
  {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: request.username },
      });
      const friend = await this.prisma.user.findUnique({
        where: { username: friendUsername },
      });

      const findexist = await this.prisma.friends.findUnique({
        // check if friend exists
        where: { username: friend.username },
      });
      if (!findexist) {
        return new HttpException('Friend not found', 400);
      }

      const otherside = await this.prisma.friends.update({
        where: { username: user.username },
        data: { friendshipStatus: 'Blocked' },
      });

      const newFriend = await this.prisma.friends.update({
        where: { username: friend.username },
        data: { friendshipStatus: 'Blocked' },
      });
      return new HttpException('Friend blocked', 200);
    }
    catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
    }

  }

    


}
