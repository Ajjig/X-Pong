import { channel } from 'diagnostics_channel';
import {
  Injectable,
  HttpException,
  NotFoundException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { UserPasswordService } from './user.password.service';
import { OrigineService } from './user.validate.origine.service';
import { compareSync } from 'bcrypt';
import { CreateChannelPayloadDto } from './dto/create.channel.payload.dto';

@Injectable()
export class UserChannelService {
  constructor(
    private prisma: PrismaService,
    private UserPasswordService: UserPasswordService,
    private OrigineService: OrigineService,
  ) {}

  async createChannelByUsername(
    userId: number,
    channel: CreateChannelPayloadDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user == null) {
      throw new HttpException('User does not exist', 400);
    }

    const check_password = this.UserPasswordService.validatePassword(
      channel.password,
    );
    if (channel.password && (await check_password).validated == false) {
      throw new HttpException('Invalid password', 400);
    }

    if (['public', 'private', 'protected'].includes(channel.type) == false) {
      throw new HttpException('Invalid channel type', 400);
    }

    const checkexist = await this.prisma.channel.findFirst({
      where: { name: channel.name },
    });

    if (checkexist != null) {
      throw new HttpException('Channel already exists', 400);
    }

    const newChannel = await this.prisma.channel.create({
      data: {
        members: { connect: { id: user.id } },
        admins: { connect: { id: user.id } },
        name: channel.name,
        type: channel.type,
        password:
          channel.type === 'protected' ? (await check_password).password : null,
        salt: channel.type === 'protected' ? (await check_password).salt : null,
        ownerId: user.id,
        adminsIds: { set: [user.id] },
      },
      select: {
        id: true,
        members: true,
        admins: true,
        name: true,
        type: true,
        ownerId: true,
      },
    });

    return newChannel;
  }

  async setUserAsAdminOfChannelByUsername(
    adminId: number,
    newAdminId: number,
    channelId: number,
  ) {
    let new_admin_user = await this.prisma.user.findUnique({
      where: { id: newAdminId },
      include: {
        channels: {
          where: { id: channelId },
        },
        AdminOf: {
          where: { id: channelId },
        },
      },
    });
    if (new_admin_user == null) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    if (new_admin_user.channels.length == 0) {
      throw new HttpException('User is not member of channel', 400);
    }
    if (new_admin_user.AdminOf.length != 0) {
      throw new HttpException('User is already admin of channel', 400);
    }

    let admin_user = await this.prisma.user.findUnique({
      where: { id: adminId },
    });
    if (admin_user == null) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    let channel = await this.prisma.channel.findUnique({
      // check if channel exists
      where: { id: channelId },
    });
    if (channel == null) {
      throw new HttpException('Channel does not exist', HttpStatus.NOT_FOUND);
    }

    let admin_of = await this.prisma.user.findUnique({
      // check if user is admin of channel
      where: { id: adminId },
      include: {
        AdminOf: {
          where: { id: channelId },
        },
      },
    });

    if (admin_of.AdminOf.length == 0) {
      throw new HttpException(
        'User is not admin OR not member of channel',
        400,
      );
    } else {
      await this.prisma.channel.update({
        // add user as admin of channel
        where: { id: channelId },
        data: {
          admins: {
            connect: { id: new_admin_user.id },
          },
          adminsIds: { push: new_admin_user.id },
          members: { connect: { id: new_admin_user.id } },
        },
      });
      throw new HttpException('User is now admin of channel', 200);
    }
  }

  async setUserAsMemberOfChannelByID(
    userId: number, // the requester JWT
    new_member: number,
    channelId: number,
  ) {
    let userIdObjet = await this.prisma.user.findUnique({
      // check if user exists
      where: { id: userId },
      include: {
        channels: {
          where: { id: channelId },
        },
      },
    });
    if (userIdObjet == null) {
      throw new HttpException('userId does not exist', HttpStatus.NOT_FOUND);
    }
    if (userIdObjet.channels.length == 0) {
      throw new HttpException(
        'User is not member of channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    let new_user_member = await this.prisma.user.findUnique({
      // check if user exists
      where: { id: new_member },
      include: {
        channels: {
          where: { id: channelId },
        },
      },
    });
    if (new_user_member == null) {
      throw new HttpException(
        'new member does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    if (new_user_member.channels.length != 0) {
      throw new HttpException(
        'User is already member of channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    let channel = await this.prisma.channel.findUnique({
      // check if channel exists
      where: { id: channelId },
    });
    if (channel == null) {
      throw new HttpException('Channel does not exist', HttpStatus.NOT_FOUND);
    } else {
      await this.prisma.channel.update({
        where: { id: channelId },
        data: {
          members: {
            connect: { id: new_user_member.id },
          },
        },
      });
      throw new HttpException('User added as member of channel', HttpStatus.OK);
    }
  }

  async changeChannelPasswordByUsername(
    adminId: number,
    channelId: number,
    password: string,
  ) {
    let new_admin_user = await this.prisma.user.findUnique({
      // check if user exists
      where: { id: adminId },
    });
    if (new_admin_user == null) {
      throw new HttpException('Admin does not exist', HttpStatus.NOT_FOUND);
    }

    let channel = await this.prisma.channel.findUnique({
      // check if channel exists
      where: { id: channelId },
    });

    if (channel.ownerId != new_admin_user.id) {
      throw new HttpException(
        'User is not owner of channel',
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      const check_password =
        this.UserPasswordService.validatePassword(password);
      if ((await check_password).validated == false) {
        throw new HttpException('Weak password', HttpStatus.BAD_REQUEST);
      } else {
        await this.prisma.channel.update({
          where: { id: channelId },
          data: {
            password: (await check_password).password,
            salt: (await check_password).salt,
            type: 'protected',
          },
        });
      }
    }
    throw new HttpException('Password changed', HttpStatus.OK);
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
        throw new HttpException('Channel does not exist', 400);
      }

      if (channelcheck.type == 'public') {
        throw new HttpException('Channel is public', 400);
      }

      const new_hash = await this.UserPasswordService.createhashPassword(
        password,
        channelcheck.salt,
      );

      if (new_hash.password == channelcheck.password) {
        return { channel };
      } else {
        throw new HttpException('Password incorrect', 400);
      }
    } catch (e) {
      throw new HttpException(e.meta, 400);
    }
  }

  async removeChannelPasswordByUsername(username: number, channelId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: username },
      include: {
        channels: {
          where: { id: channelId },
        },
      },
    });

    if (user == null) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    if (user.channels.length == 0) {
      throw new HttpException(
        'User is not member of channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (channel == null) {
      throw new HttpException('Channel does not exist', HttpStatus.NOT_FOUND);
    }

    if (channel.ownerId != user.id) {
      throw new HttpException(
        'User is not owner of channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        password: null,
        type: 'public',
      },
    });
    throw new HttpException('Password removed', HttpStatus.OK);
  }

  async setUserAsBannedOfChannelByUsername(
    admin: string,
    new_banned: string,
    channelname: string,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: admin },
      });

      if (user == null) {
        throw new HttpException('User does not exist', 400);
      }

      const channel = await this.prisma.channel.findUnique({
        where: { name: channelname },
      });

      if (channel == null) {
        throw new HttpException('Channel does not exist', 400);
      }

      const admin_check = await this.prisma.channel.findFirst({
        where: {
          name: channelname,
          admins: {
            some: {
              username: admin,
            },
          },
        },
      });

      if (admin_check == null) {
        throw new HttpException('User is not admin of channel', 400);
      }

      const banned_user = await this.prisma.user.findUnique({
        where: { username: new_banned },
      });

      if (banned_user == null) {
        throw new HttpException('User does not exist', 400);
      }

      // check if user is already banned
      const banned_check = await this.prisma.channel.findFirst({
        where: {
          name: channelname,
          banned: {
            some: {
              username: new_banned,
            },
          },
        },
      });

      if (banned_check != null) {
        throw new HttpException('User is already banned', 400);
      }

      await this.prisma.channel.update({
        where: { name: channelname },
        data: {
          banned: {
            connect: { id: banned_user.id },
          },
        },
      });
      return { channelname };
    } catch (e) {
      throw new HttpException(e.meta, 400);
    }
  }

  async setUserAsKickedOfChannelByUsername(
    request: any,
    new_kicked: string,
    channelname: string,
  ) {
    const adminCheck = await this.OrigineService.is_admin_of_channel(
      channelname,
      request,
    );
    if (adminCheck == false) {
      throw new HttpException('User is not admin of channel', 400);
    }

    const kicked_user = await this.prisma.user.findUnique({
      where: { username: new_kicked },
    });

    if (kicked_user == null) {
      throw new HttpException(`doesn't exist`, 400);
    }

    // check if user is already banned
    const banned_check = await this.prisma.channel.findFirst({
      where: {
        name: channelname,
        kicked: {
          some: {
            username: new_kicked,
          },
        },
      },
    });

    if (banned_check != null) {
      throw new HttpException('User is already Kicked', 400);
    }

    await this.prisma.channel.update({
      where: { name: channelname },
      data: {
        kicked: {
          connect: { id: kicked_user.id },
        },
      },
    });

    return { kicked_user };
  }

  async setUserAsMutedOfChannelByUsername(
    request: any,
    new_muted: string,
    channelname: string,
  ) {
    const adminCheck = await this.OrigineService.is_admin_of_channel(
      channelname,
      request,
    );
    if (adminCheck == false) {
      throw new HttpException('User is not admin of channel', 400);
    }

    const muted_user = await this.prisma.user.findUnique({
      where: { username: new_muted },
    });

    if (muted_user == null) {
      throw new HttpException('user not exist', 400);
    }

    // check if user is already banned
    const muted_check = await this.prisma.channel.findFirst({
      where: {
        name: channelname,
        muted: {
          some: {
            username: new_muted,
          },
        },
      },
    });

    if (muted_check != null) {
      throw new HttpException('User is already muted', 400);
    }

    await this.prisma.channel.update({
      where: { name: channelname },
      data: {
        muted: {
          connect: { id: muted_user.id },
        },
      },
    });

    return { muted_user };
  }

  async setUserAsUnmutedOfChannelByUsername(
    request: any,
    new_unmuted: string,
    channelname: string,
  ) {
    const adminCheck = await this.OrigineService.is_admin_of_channel(
      channelname,
      request,
    );
    if (adminCheck == false) {
      throw new HttpException('User is not admin of channel', 400);
    }

    const muted_user = await this.prisma.user.findUnique({
      where: { username: new_unmuted },
    });

    if (muted_user == null) {
      throw new HttpException('User does not exist', 400);
    }

    // check if user is already banned
    const muted_check = await this.prisma.channel.findFirst({
      where: {
        name: channelname,
        muted: {
          some: {
            username: new_unmuted,
          },
        },
      },
    });

    if (muted_check == null) {
      throw new HttpException('User is not muted', 400);
    }

    await this.prisma.channel.update({
      where: { name: channelname },
      data: {
        muted: {
          disconnect: { id: muted_user.id },
        },
      },
    });

    return { muted_user };
  }

  async setUserAsUnbannedOfChannelByUsername(
    request: any,
    new_unbanned: string,
    channelname: string,
  ) {
    const adminCheck = await this.OrigineService.is_admin_of_channel(
      channelname,
      request,
    );
    if (adminCheck == false) {
      throw new HttpException('User is not admin of channel', 400);
    }

    const banned_user = await this.prisma.user.findUnique({
      where: { username: new_unbanned },
    });

    if (banned_user == null) {
      throw new HttpException('User does not exist', 400);
    }

    // check if user is already banned
    const banned_check = await this.prisma.channel.findFirst({
      where: {
        name: channelname,
        banned: {
          some: {
            username: new_unbanned,
          },
        },
      },
    });

    if (banned_check == null) {
      throw new HttpException('User is not banned', 400);
    }

    await this.prisma.channel.update({
      where: { name: channelname },
      data: {
        banned: {
          disconnect: { id: banned_user.id },
        },
      },
    });

    return { banned_user };
  }

  async setUserAsUnkickedOfChannelByUsername(
    request: any,
    new_unkicked: string,
    channelname: string,
  ) {
    const adminCheck = await this.OrigineService.is_admin_of_channel(
      channelname,
      request,
    );
    if (adminCheck == false) {
      throw new HttpException('User is not admin of channel', 400);
    }

    const kicked_user = await this.prisma.user.findUnique({
      where: { username: new_unkicked },
    });

    if (kicked_user == null) {
      throw new HttpException('User does not exist', 400);
    }

    // check if user is already banned
    const kicked_check = await this.prisma.channel.findFirst({
      where: {
        name: channelname,
        kicked: {
          some: {
            username: new_unkicked,
          },
        },
      },
    });

    if (kicked_check == null) {
      throw new HttpException('User is not kicked', 400);
    }

    await this.prisma.channel.update({
      where: { name: channelname },
      data: {
        kicked: {
          disconnect: { id: kicked_user.id },
        },
      },
    });

    return { kicked_user };
  }

  async HandleChannelOwnerLeaveChannel(owner_check: any, userId: number) {
    if (owner_check == null) {
      throw new HttpException('Channel not exist', 400);
    }

    /* update the owner of the channel with the first admin 
    of the channel if no admin exist then delete the channel*/
    const channel = await this.prisma.channel.findUnique({
      where: { name: owner_check.name },
      include: { admins: true },
    });


    const firstAdmin = channel.admins.find(
      (admin) => admin.id !== userId,
    );
    if (firstAdmin) {
      await this.prisma.channel.update({
        where: { name: owner_check.name },
        data: { ownerId: firstAdmin.id },
      });
    } else {
      await this.prisma.channel.delete({
        where: { name: owner_check.name },
      });
    }

    // remove the user from the channel
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        channels: {
          disconnect: { name: owner_check.name },
        },
        AdminOf: {
          disconnect: { name: owner_check.name },
        },
      },
    });

    // remove the the new owner from kicked or banned or muted list
    await this.prisma.channel.update({
      where: { name: owner_check.name },
      data: {
        kicked: {
          disconnect: { username: firstAdmin.username },
        },
        banned: {
          disconnect: { username: firstAdmin.username },
        },
        muted: {
          disconnect: { username: firstAdmin.username },
        },
        adminsIds : { 
          set : channel.adminsIds.filter((id) => id !== firstAdmin.id),
        },
      },
    });
  }

  async leaveChannelByUsername(
    userId: number,
    channelId: number,
  ): Promise<any> {
    // check if the user is a channel member or channel exist
    const member_check = await this.prisma.user.findFirst({
      where: {
        id: userId,
        channels: { some: { id: channelId } },
      },
    });

    if (member_check == null) {
      throw new HttpException(
        'User is not a member of the channel or channel not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if the user is the owner of the channel
    const owner_check = await this.prisma.channel.findFirst({
      where: {
        id: channelId,
      },
    });
    if (owner_check.ownerId == member_check.id) {
      this.HandleChannelOwnerLeaveChannel(
        owner_check,
        userId,
      );
    } else {
      // remove the non owner user from the channel
      await this.prisma.channel.update({
        where: { id: channelId },
        data: {
          members: {
            disconnect: { id: userId },
          },
          admins: {
            disconnect: { id: userId },
          },
          // remove the user from the adminsIds list
          adminsIds: {
            set: owner_check.adminsIds.filter(
              (adminId) => adminId !== userId,
            ),
          },
              
        },
      });
    }

    throw new HttpException('User left the channel', HttpStatus.OK);
  }

  getAllPublicChannels(): Promise<any> {
    return this.prisma.channel.findMany({
      where: { type: 'public' },
      select: {
        name: true,
        type: true,
        ownerId: true,
        id: true,
        createdAt: true,
      },
    });
  }

  async checkIfUserIsBlockedFromChannel(
    // banned
    userID: number,
    channelID: number,
  ): Promise<boolean> {
    const blocked_check = await this.prisma.user.findFirst({
      where: {
        id: userID,
        bannedFrom: {
          some: {
            id: channelID,
          },
        },
      },
    });

    if (blocked_check != null) {
      return true;
    } else {
      return false;
    }
  }

  async checkIfUserIsMutedFromChannel(
    userID: number,
    channelID: number,
  ): Promise<boolean> {
    const muted_check = await this.prisma.user.findFirst({
      where: {
        id: userID,
        mutedFrom: {
          some: {
            id: channelID,
          },
        },
      },
    });

    if (muted_check != null) {
      return true;
    } else {
      return false;
    }
  }

  async checkIfUserIsKickedFromChannel(
    userID: number,
    channelID: number,
  ): Promise<boolean> {
    const kicked_check = await this.prisma.user.findFirst({
      where: {
        id: userID,
        kickedFrom: {
          some: {
            id: channelID,
          },
        },
      },
    });

    if (kicked_check != null) {
      return true;
    } else {
      return false;
    }
  }

  async joinChannelByUsername(
    username: string,
    channelID: number,
    password: string | null,
  ): Promise<any> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelID },
    });

    if (channel == null) {
      throw new NotFoundException('Channel does not exist');
    }

    if (channel.type == 'private') {
      throw new HttpException('Channel is private', 400);
    }

    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });

    if (user == null) {
      throw new NotFoundException('User does not exist');
    }

    const member_check = await this.prisma.user.findFirst({
      where: {
        username: username,
        channels: { some: { id: channelID } },
      },
    });

    if (member_check != null) {
      throw new HttpException('User is already a member of the channel', 400);
    }

    const blocked_check = await this.checkIfUserIsBlockedFromChannel(
      user.id,
      channelID,
    );

    if (blocked_check == true) {
      throw new HttpException('User is blocked from the channel', 400);
    }

    if (channel.type == 'protected' && password != null) {
      const password_check = await this.UserPasswordService.checkPassword(
        password,
        channel.password,
      );

      if (password_check == false) {
        throw new HttpException('Wrong channel password', 400);
      }
    } else if (channel.type == 'protected' && password == null) {
      throw new HttpException('Channel is protected', 400);
    }

    await this.prisma.channel.update({
      where: { id: channelID },
      data: {
        members: {
          connect: { username: username },
        },
      },
    });

    return HttpStatus.ACCEPTED;
  }

  async getChannelInfo(user: number, channelID: number): Promise<any> {
    let channel = await this.prisma.channel.findUnique({
      where: { id: channelID },
      select: {
        name: true,
        type: true,
        id: true,
        members: {
          select: {
            username: true,
            id: true,
            avatarUrl: true,
            name: true,
          },
        },
      },
    });

    if (channel == null) {
      throw new NotFoundException('Channel does not exist');
    }

    // find the user in the channel members exists

    let userChannels = (
      await this.prisma.user.findUnique({
        where: { id: user },
        select: {
          channels: true,
        },
      })
    ).channels;

    userChannels = userChannels.filter((channel) => channel.id == channelID);

    channel['is_member'] = userChannels && userChannels.length > 0;
    channel['membersCount'] = channel.members.length;
    delete channel.members;
    return channel;
  }

  async getChannelUsers(userId: number, channelID: number): Promise<any> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelID },
      select: {
        members: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            name: true,
          },
        },
      },
    });

    if (channel == null) {
      throw new NotFoundException('Channel does not exist');
    }

    const channelMembers = channel.members;

    const userChannels = (
      await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          channels: true,
        },
      })
    ).channels;

    const isMember = userChannels.filter((channel) => channel.id == channelID);

    if (isMember.length == 0) {
      throw new HttpException('User is not a member of the channel', 400);
    }

    return channelMembers;
  }
}
