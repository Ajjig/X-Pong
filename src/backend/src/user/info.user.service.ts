import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { UserPasswordService } from './user.password.service';
import { OrigineService } from './user.validate.origine.service';

@Injectable()
export class InfoUserService {
  constructor(
    private prisma: PrismaService,
    private UserPasswordService: UserPasswordService,
    private OrigineService: OrigineService,
  ) {}

  async get_any_user_info(anyusername: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: anyusername },
      select: {
        username: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        confirmed: true,
        onlineStatus: true,
        name: true,
        email: true,
        Matchs: true,
        Userstats: true,
        channels: true,
        Friends: true,
      },
    });

    if (user == null) {
      throw new HttpException('User does not exist', 400);
    }

    return user;
  }

  async search_on_users_or_channels(sreach: string) {
    // the search is case insensitive
    // the search string can be a part of the username or channel name

    const users = await this.prisma.user.findMany({
      where: {
        username: {
          contains: sreach,
          mode: 'insensitive',
        },
      },
      select: {
        username: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        confirmed: true,
        onlineStatus: true,
        name: true,
        email: true,
      },
    });

    const channels = await this.prisma.channel.findMany({
      where: {
        name: {
          contains: sreach,
          mode: 'insensitive',
        },
      },
      select: {
        name: true,
        createdAt: true,
        updatedAt: true,
        owner: true,
        type: true,
      },
    });

    return { users, channels };
  }
}
