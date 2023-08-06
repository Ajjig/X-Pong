import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { UserPasswordService } from './user.password.service';

@Injectable()
export class OrigineService {
  constructor(
    private prisma: PrismaService,
    private UserPasswordService: UserPasswordService,
  ) {}

  async validate_user_origin(user: string, request: any): Promise<boolean> {
    if (!request.username || !user) return false;
    if (request.username === user) return true;
  }

  async is_admin_of_channel(channel: number, userId: number): Promise<boolean> {
    const admin_check = await this.prisma.channel.findFirst({
      where: {
        id: channel,
        admins: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!admin_check) return false;
    return true;
  }

  async is_owner_of_channel(channel: number, userId: number): Promise<boolean> {
    const owner_check = await this.prisma.channel.findFirst({
      where: {
        id: channel,
        ownerId: userId,
      },
    });

    if (!owner_check) return false;
    return true;
  }
}
