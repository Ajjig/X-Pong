import { Injectable, HttpException } from '@nestjs/common';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private JwtService: JwtService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        username: data.username,
        Userstats: {
          create: {
            wins: 0,
            losses: 0,
            ladder: 'bronze',
            achievements: [],
          },
        },
        blockedUsernames: [],
      },
    });
  }

  async findUserByUsername(username: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { username: username },

      select: {
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        onlineStatus: true,
        confirmed: true,
        istwoFactor: true,
      },
    });
  }

  async findOrCreateUser(profile: any): Promise<any> {
    let user = await this.findUserByUsername(
      profile.username,
    );

    if (!user) {
      user = await this.createUser({
        email: profile.emails[0].value,
        name: profile.displayName,
        username: profile.username,
        oauthId: '',
      });
    }
    return user;
  }

  async login(user: any) {
    const payload = { name: user.name, username: user.username, sub: user.id };
    const userData = await this.findUserByUsername(user.username);
    return { access_token: this.JwtService.sign(payload), data: userData};
  }
}
