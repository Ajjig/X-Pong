import { Injectable } from '@nestjs/common';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';

export type UserFilted = {
  id: number
  email: string
  name: string
  username: string | null
  avatarUrl: string
  onlineStatus: string
  blockedUsernames: string[]
  createdAt: Date
  updatedAt: Date
};

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private JwtService : JwtService) {}

  

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        username: data.username,
        oauthId: data.oauthId,
      }
    });
  }

  async findOrCreateUser(profile: any): Promise<UserFilted> {
    let user = await this.prisma.user.findUnique({ 

      where: { email : profile.emails[0].value },
      
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        onlineStatus: true,
        blockedUsernames: true,
        createdAt: true,
        updatedAt: true,
      },
     
    });
    
    
    if (!user) {
      user = await this.createUser({
        email: profile.emails[0].value,
        name: profile.displayName,
        username : profile.login,
        oauthId : '',
      });
    }
    return user;
  }

  async login(user: any) {
    console.log(user);
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: this.JwtService.sign(payload),
    };
  }
}