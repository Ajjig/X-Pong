import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { UserPasswordService } from './user.password.service';
import e from 'express';

@Injectable()
export class UserChannelService {
  constructor(
    private prisma: PrismaService,
    private UserPasswordService: UserPasswordService,
  ) {}

  async createChannelByUsername(
    username: string,
    channel: Prisma.ChannelCreateInput,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
      });

      if (user == null) {
        return new HttpException('User does not exist', 400);
      }

      const check_password = this.UserPasswordService.validatePassword(
        channel.password,
      );
      if ((await check_password).validated == false) {
        return new HttpException('Weak password', 400);
      }

      const newChannel = await this.prisma.channel.create({
        data: {
          members: { connect: { id: user.id } },
          admins: { connect: { id: user.id } },
          name: channel.name,
          isPublic: channel.isPublic,
          password: channel.isPublic ? null : (await check_password).password,
          salt: channel.isPublic ? null : (await check_password).salt,
          owner: channel.owner ? channel.owner : user.username,
        },
      });
      return new HttpException('Channel created', 200);
    } catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
    }
  }

  async setUserAsAdminOfChannelByUsername(
    admin: string,
    new_admin: string,
    channelname: string,
  ) {
    try {
      let new_admin_user = await this.prisma.user.findUnique({
        // check if user exists
        where: { username: new_admin },
      });
      if (new_admin_user == null) {
        return new HttpException('User does not exist', 400);
      }

      let admin_user = await this.prisma.user.findUnique({
        // check if user exists
        where: { username: admin },
      });
      if (admin_user == null) {
        return new HttpException('User does not exist', 400);
      }

      let channel = await this.prisma.channel.findUnique({
        // check if channel exists
        where: { name: channelname },
      });
      if (channel == null) {
        return new HttpException('Channel does not exist', 400);
      }

      let admin_of = await this.prisma.user.findUnique({
        // check if user is admin of channel
        where: { username: admin },
        include: {
          AdminOf: {
            where: { name: channelname },
          },
        },
      });

      if (admin_of == null) {
        return new HttpException('User is not admin of channel', 400);
      } else {
        await this.prisma.channel.update({
          // add user as admin of channel
          where: { name: channelname },
          data: {
            admins: {
              connect: { id: new_admin_user.id },
            },
            members: { connect: { id: new_admin_user.id } },
          },
        });
        return new HttpException('Admin added', 200);
      }
    } catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
    }
  }

  async setUserAsMemberOfChannelByUsername(
    admin: string,
    new_member: string,
    channelname: string,
  ) {
    try {
      let new_admin_user = await this.prisma.user.findUnique({
        // check if user exists
        where: { username: admin },
      });
      if (new_admin_user == null) {
        return new HttpException('Admin does not exist', 400);
      }

      let new_user_member = await this.prisma.user.findUnique({
        // check if user exists
        where: { username: new_member },
      });
      if (new_user_member == null) {
        return new HttpException('new member does not exist', 400);
      }

      let channel = await this.prisma.channel.findUnique({
        // check if channel exists
        where: { name: channelname },
      });
      if (channel == null) {
        return new HttpException('Channel does not exist', 400);
      } else {
        await this.prisma.channel.update({
          // add user as admin of channel
          where: { name: channelname },
          data: {
            members: {
              connect: { id: new_user_member.id },
            },
          },
        });
        return new HttpException('Member added', 200);
      }
    } catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
    }
  }

  async changeChannelPasswordByUsername(
    admin: string,
    channelname: string,
    password: string,
  ) {
    try {
      let new_admin_user = await this.prisma.user.findUnique({
        // check if user exists
        where: { username: admin },
      });
      if (new_admin_user == null) {
        return new HttpException('Admin does not exist', 400);
      }

      let channel = await this.prisma.channel.findUnique({
        // check if channel exists
        where: { name: channelname },
      });

      if (channel.owner != admin) {
        return new HttpException('User is not owner of channel', 400);
      } else {
        const check_password =
          this.UserPasswordService.validatePassword(password);
        if ((await check_password).validated == false) {
          return new HttpException('Weak password', 400);
        } else {
          await this.prisma.channel.update({
            where: { name: channelname },
            data: {
              password: (await check_password).password,
              salt: (await check_password).salt,
            },
          });
          return new HttpException('Password changed', 200);
        }
      }
    } catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
    }
  }

  async checkChannelPasswordByUsername(
    username: string,
    channelname: string,
    password: string,
  ) {
    try {
      const channelcheck = await this.prisma.channel.findUnique({
        where: { name: channelname },
      });
      if (channelcheck == null) {
        return new HttpException('Channel does not exist', 400);
      }

      if (channelcheck.isPublic == true) {
        return new HttpException('Channel is public', 400);
      }

      const new_hash = await this.UserPasswordService.createhashPassword(
        password,
        channelcheck.salt,
      );

      if (new_hash.password == channelcheck.password) {
        return new HttpException('Password correct', 200);
      } else {
        return new HttpException('Password incorrect', 400);
      }
    } catch (e) {
      console.log(e);
      return new HttpException(e.meta, 400);
    }
  }
}
