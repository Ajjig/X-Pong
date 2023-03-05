import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { stat } from 'fs';

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

    } catch (e)
    { 
      console.log(e);
      return new HttpException(e.meta, 400);
    }
    
  }
}
