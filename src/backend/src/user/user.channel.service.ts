import { channel } from 'diagnostics_channel';
import { Injectable, HttpException, NotFoundException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { UserPasswordService } from './user.password.service';
import { OrigineService } from './user.validate.origine.service';
import { compareSync } from 'bcrypt';
import { CreateChannelPayloadDto } from './dto/create.channel.payload.dto';
import { UpdateChannelDto } from './dto/update.channel.dto';

@Injectable()
export class UserChannelService {
    constructor(
        private prisma: PrismaService,
        private UserPasswordService: UserPasswordService,
        private OrigineService: OrigineService,
    ) {}

    async createChannelByUsername(userId: number, channel: CreateChannelPayloadDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user == null) {
            throw new HttpException('User does not exist', 400);
        }

        const check_password = this.UserPasswordService.validatePassword(channel.password);
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
                password: channel.type === 'protected' ? (await check_password).password : null,
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

    async setUserAsAdminOfChannelByUsername(adminId: number, newAdminId: number, channelId: number) {
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
            throw new HttpException('User is not admin OR not member of channel', 400);
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
                Friends: true,
            },
        });
        if (userIdObjet == null) {
            throw new HttpException('userId does not exist', HttpStatus.NOT_FOUND);
        }
        if (userIdObjet.channels.length == 0) {
            throw new HttpException('User is not member of channel', HttpStatus.UNAUTHORIZED);
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
            throw new HttpException('new member does not exist', HttpStatus.NOT_FOUND);
        }
        if (new_user_member.channels.length != 0) {
            throw new HttpException('User is already member of channel', HttpStatus.BAD_REQUEST);
        }

        let channel = await this.prisma.channel.findUnique({
            // check if channel exists
            where: { id: channelId },
        });

        // check if the new_member is blocked from the inviting user
        let blocked = false;
        userIdObjet.Friends.forEach((friend) => {
            if (friend.friendId == new_member) {
                if (friend.friendshipStatus == 'Blocked') {
                    blocked = true;
                }
            }
        });
        if (blocked) {
            throw new HttpException('You cannot add a blocked user', HttpStatus.UNAUTHORIZED);
        }

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

    async changeChannelPasswordByUsername(adminId: number, channelId: number, password: string) {
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
            throw new HttpException('User is not owner of channel', HttpStatus.UNAUTHORIZED);
        } else {
            const check_password = this.UserPasswordService.validatePassword(password);
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

    async checkChannelPasswordByUsername(channelname: string, password: string) {
        try {
            const channelcheck = await this.prisma.channel.findFirst({
                where: { name: channelname },
            });
            if (channelcheck == null) {
                throw new HttpException('Channel does not exist', 400);
            }

            if (channelcheck.type == 'public') {
                throw new HttpException('Channel is public', 400);
            }

            const new_hash = await this.UserPasswordService.createhashPassword(password, channelcheck.salt);

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
            throw new HttpException('User is not member of channel', HttpStatus.UNAUTHORIZED);
        }

        const channel = await this.prisma.channel.findUnique({
            where: { id: channelId },
        });

        if (channel == null) {
            throw new HttpException('Channel does not exist', HttpStatus.NOT_FOUND);
        }

        if (channel.ownerId != user.id) {
            throw new HttpException('User is not owner of channel', HttpStatus.UNAUTHORIZED);
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

    async setUserAsBannedOfChannelByUsername(userId: number, BannedId: number, channelId: number) {
        const SelfadminCheck = await this.OrigineService.is_admin_of_channel(channelId, userId);
        const SelfownerCheck = await this.OrigineService.is_owner_of_channel(channelId, userId);
        if (SelfadminCheck == false || SelfownerCheck == false) {
            throw new HttpException('You are not allowed to Ban Users', HttpStatus.UNAUTHORIZED);
        }

        const checkChannelExist = await this.prisma.channel.findUnique({
            where: { id: channelId },
        });
        if (checkChannelExist == null) {
            throw new HttpException('Channel does not exist', HttpStatus.NOT_FOUND);
        }

        const bannedUser = await this.prisma.user.findUnique({
            where: { id: BannedId },
        });

        if (bannedUser == null) {
            throw new HttpException(`User to Ban doesn't exist`, HttpStatus.NOT_FOUND);
        }

        // check if user is already banned
        const bannedCheck = await this.prisma.channel.findFirst({
            where: {
                id: channelId,
                banned: {
                    some: {
                        id: BannedId,
                    },
                },
            },
        });

        if (bannedCheck != null) {
            throw new HttpException('User is already Banned', HttpStatus.BAD_REQUEST);
        }

        // IF THE USER IS OWNER OF THE CHANNEL HE CAN Ban ADMINS AND USERS
        if (SelfownerCheck == true) {
            await this.prisma.channel.update({
                where: { id: channelId },
                data: {
                    banned: {
                        connect: { id: BannedId },
                    },
                    admins: {
                        disconnect: { id: BannedId },
                    },
                    members: {
                        disconnect: { id: BannedId },
                    },
                    adminsIds: {
                        set: checkChannelExist.adminsIds.filter((id) => id !== BannedId),
                    },
                },
            });
            throw new HttpException('User is Banned', HttpStatus.OK);
        }
        // IF THE USER IS ADMIN OF THE CHANNEL HE CAN Ban USERS BUT NOT ADMINS AND OWNERS
        if (SelfadminCheck == true) {
            const UserToKickIsAdmin = await this.OrigineService.is_admin_of_channel(channelId, BannedId);
            const UserToKickIsOwner = await this.OrigineService.is_owner_of_channel(channelId, BannedId);
            if (UserToKickIsAdmin == true || UserToKickIsOwner == true) {
                throw new HttpException('You are not allowed to Ban Admins or Owners', HttpStatus.UNAUTHORIZED);
            }
            await this.prisma.channel.update({
                where: { id: channelId },
                data: {
                    banned: {
                        connect: { id: BannedId },
                    },
                    members: {
                        disconnect: { id: BannedId },
                    },
                },
            });
            throw new HttpException('User is banned', HttpStatus.OK);
        }
    }

    async setUserAsKickedOfChannelByUsername(userId: number, new_kicked: number, channelId: number) {
        const SelfadminCheck = await this.OrigineService.is_admin_of_channel(channelId, userId);
        const SelfownerCheck = await this.OrigineService.is_owner_of_channel(channelId, userId);
        if (SelfadminCheck == false || SelfownerCheck == false) {
            throw new HttpException('You are not allowed to Kick Users', HttpStatus.UNAUTHORIZED);
        }

        const checkChannelExist = await this.prisma.channel.findUnique({
            where: { id: channelId },
        });
        if (checkChannelExist == null) {
            throw new HttpException('Channel does not exist', HttpStatus.NOT_FOUND);
        }

        const kicked_user = await this.prisma.user.findUnique({
            where: { id: new_kicked },
        });

        if (kicked_user == null) {
            throw new HttpException(`User to kick doesn't exist`, HttpStatus.NOT_FOUND);
        }

        // check if user is already kicked
        const kickedCheck = await this.prisma.channel.findFirst({
            where: {
                id: channelId,
                kicked: {
                    some: {
                        id: new_kicked,
                    },
                },
            },
        });

        if (kickedCheck != null) {
            throw new HttpException('User is already Kicked', HttpStatus.BAD_REQUEST);
        }

        // IF THE USER IS OWNER OF THE CHANNEL HE CAN KICK ADMINS AND USERS
        if (SelfownerCheck == true) {
            await this.prisma.channel.update({
                where: { id: channelId },
                data: {
                    kicked: {
                        connect: { id: new_kicked },
                    },
                    admins: {
                        disconnect: { id: new_kicked },
                    },
                    members: {
                        disconnect: { id: new_kicked },
                    },
                    adminsIds: {
                        set: checkChannelExist.adminsIds.filter((id) => id !== new_kicked),
                    },
                },
            });
            throw new HttpException('User is Kicked', HttpStatus.OK);
        }

        // IF THE USER IS ADMIN OF THE CHANNEL HE CAN KICK USERS BUT NOT ADMINS AND OWNERS
        if (SelfadminCheck == true) {
            const UserToKickIsAdmin = await this.OrigineService.is_admin_of_channel(channelId, new_kicked);
            const UserToKickIsOwner = await this.OrigineService.is_owner_of_channel(channelId, new_kicked);
            if (UserToKickIsAdmin == true || UserToKickIsOwner == true) {
                throw new HttpException('You are not allowed to Kick Admins or Owners', HttpStatus.UNAUTHORIZED);
            }
            await this.prisma.channel.update({
                where: { id: channelId },
                data: {
                    kicked: {
                        connect: { id: new_kicked },
                    },
                    members: {
                        disconnect: { id: new_kicked },
                    },
                },
            });
            throw new HttpException('User is Kicked', HttpStatus.OK);
        }
    }

    async leaveChannelByUsername(userId: number, channelId: number): Promise<any> {
        // check if the user is a channel member or channel exist
        const member_check = await this.prisma.user.findFirst({
            where: {
                id: userId,
                channels: { some: { id: channelId } },
            },
        });

        if (member_check == null) {
            throw new HttpException('User is not a member of the channel or channel not exist', HttpStatus.BAD_REQUEST);
        }

        // check if the user is the owner of the channel
        const owner_check = await this.prisma.channel.findFirst({
            where: {
                id: channelId,
            },
        });

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
                    set: owner_check.adminsIds.filter((adminId) => adminId !== userId),
                },
            },
        });
        // }

        throw new HttpException('User left the channel', HttpStatus.OK);
    }

    getAllPublicChannels(): Promise<any> {
        let channels = this.prisma.channel.findMany({
            where: {
                OR: [{ type: 'public' }, { type: 'protected' }],
            },
            select: {
                name: true,
                type: true,
                ownerId: true,
                id: true,
                createdAt: true,
                members: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        return channels;
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

    async checkIfUserIsMutedFromChannel(userID: number, channelID: number): Promise<boolean> {
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

    async checkIfUserIsKickedFromChannel(userID: number, channelID: number): Promise<boolean> {
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

    async joinChannelByUsername(userId: number, channelID: number, password: string | null): Promise<any> {
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
            where: { id: userId },
        });

        if (user == null) {
            throw new NotFoundException('User does not exist');
        }

        const member_check = await this.prisma.user.findFirst({
            where: {
                id: userId,
                channels: { some: { id: channelID } },
            },
        });

        if (member_check != null) {
            throw new HttpException('User is already a member of the channel', 400);
        }

        const blocked_check = await this.checkIfUserIsBlockedFromChannel(user.id, channelID);

        if (blocked_check == true) {
            throw new HttpException('User is blocked from the channel', 400);
        }

        if (channel.type == 'protected' && password != null) {
            const password_check = await this.UserPasswordService.checkPassword(password, channel.password);

            if (password_check == false) {
                throw new HttpException('Wrong channel password', 400);
            }
        } else if (channel.type == 'protected' && password == null) {
            throw new HttpException('Channel is protected', 400);
        }

        if (user.id == channel.ownerId) {
            await this.prisma.channel.update({
                where: { id: channelID },
                data: {
                    members: {
                        connect: { id: userId },
                    },
                    admins: {
                        connect: { id: userId },
                    },
                    adminsIds: {
                        set: channel.adminsIds.concat(user.id),
                    },
                },
            });
            return HttpStatus.ACCEPTED;
        }

        await this.prisma.channel.update({
            where: { id: channelID },
            data: {
                members: {
                    connect: { id: userId },
                },
                kicked: {
                    disconnect: { id: userId },
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

    async removeAdminFromChannel(userId: number, channelID: number, adminId: number): Promise<any> {
        const channel = await this.prisma.channel.findUnique({
            where: { id: channelID },
        });

        if (channel == null) {
            throw new NotFoundException('Channel does not exist');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user == null) {
            throw new NotFoundException('User does not exist');
        }

        const admin = await this.prisma.user.findUnique({
            where: { id: adminId },
        });

        if (admin == null) {
            throw new NotFoundException('Admin does not exist');
        }

        const admin_check = await this.prisma.channel.findFirst({
            where: {
                id: channelID,
                admins: { some: { id: adminId } },
            },
        });

        if (admin_check.ownerId != userId) {
            throw new HttpException('User is not the owner of the channel', 400);
        }

        if (admin_check == null) {
            throw new HttpException('User is not an admin of the channel', 400);
        }

        await this.prisma.channel.update({
            where: { id: channelID },
            data: {
                admins: {
                    disconnect: { id: adminId },
                },
                adminsIds: {
                    set: admin_check.adminsIds.filter((id) => id != adminId),
                },
            },
        });

        return HttpStatus.ACCEPTED;
    }

    async getChannelBannedUsers(userId: number, channelID: number): Promise<any> {
        const SelfAminCheck = await this.OrigineService.is_admin_of_channel(channelID, userId);
        const SelfOwnerCheck = await this.OrigineService.is_owner_of_channel(channelID, userId);

        if (SelfAminCheck == false && SelfOwnerCheck == false) {
            throw new HttpException('User is not an admin of the channel', 400);
        }
        const channel = await this.prisma.channel.findUnique({
            where: { id: channelID },
            select: {
                banned: {
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

        const channelBanned = channel.banned;

        return channelBanned;
    }

    async setUserAsUnbannedOfChannelByUsername(userId: number, bannedId: number, channelID: number): Promise<any> {
        const SelfAminCheck = await this.OrigineService.is_admin_of_channel(channelID, userId);
        const SelfOwnerCheck = await this.OrigineService.is_owner_of_channel(channelID, userId);

        if (SelfAminCheck == false && SelfOwnerCheck == false) {
            throw new HttpException('User is not an admin of the channel', HttpStatus.BAD_REQUEST);
        }

        const channel = await this.prisma.channel.findUnique({
            where: { id: channelID },
        });

        if (channel == null) {
            throw new NotFoundException('Channel does not exist');
        }

        const banned_check = await this.prisma.channel.findFirst({
            where: {
                id: channelID,
                banned: { some: { id: bannedId } },
            },
        });

        if (banned_check == null) {
            throw new HttpException('User is not banned from the channel', HttpStatus.BAD_REQUEST);
        }

        await this.prisma.channel.update({
            where: { id: channelID },
            data: {
                banned: {
                    disconnect: { id: bannedId },
                },
                members: {
                    connect: { id: bannedId },
                },
            },
        });

        return HttpStatus.ACCEPTED;
    }

    async getChannelMutedUsers(userId: number, channelID: number): Promise<any> {
        const SelfAminCheck = await this.OrigineService.is_admin_of_channel(channelID, userId);
        const SelfOwnerCheck = await this.OrigineService.is_owner_of_channel(channelID, userId);

        if (SelfAminCheck == false && SelfOwnerCheck == false) {
            throw new HttpException('User is not an admin of the channel', HttpStatus.BAD_REQUEST);
        }
        const channel = await this.prisma.channel.findUnique({
            where: { id: channelID },
            select: {
                muted: {
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

        const channelMuted = channel.muted;

        return channelMuted;
    }

    async deleteChannel(userId: number, channelID: number): Promise<any> {
        const channel = await this.prisma.channel.findUnique({
            where: { id: channelID },
        });

        if (channel == null) {
            throw new NotFoundException('Channel does not exist');
        }

        if (channel.ownerId != userId) {
            throw new HttpException('User is not the owner of the channel', HttpStatus.BAD_REQUEST);
        }

        await this.prisma.channel.delete({
            where: { id: channelID },
        });

        return HttpStatus.ACCEPTED;
    }

    async updateChannel(userId: number, payload: UpdateChannelDto): Promise<any> {
        const channel = await this.prisma.channel.findUnique({
            where: { id: payload.channelId },
        });

        if (channel == null) {
            throw new NotFoundException('Channel does not exist');
        }

        if (channel.ownerId != userId) {
            throw new HttpException('User is not the owner of the channel', HttpStatus.BAD_REQUEST);
        }

        if (channel.type != payload.channelType && payload.channelType != null) {
            await this.prisma.channel.update({
                where: { id: payload.channelId },
                data: {
                    type: payload.channelType,
                },
            });
        }

        if (payload.channelName != channel.name && payload.channelName != null) {
            const channel_name_check = await this.prisma.channel.findFirst({
                where: { name: payload.channelName },
            });

            if (channel_name_check != null) {
                throw new HttpException('Channel name is already taken', HttpStatus.BAD_REQUEST);
            }

            await this.prisma.channel.update({
                where: { id: payload.channelId },
                data: {
                    name: payload.channelName,
                    type: payload.channelType,
                },
            });
        }

        if (payload.channelPassword != null && payload.channelType == 'protected') {
            const check_password = this.UserPasswordService.validatePassword(payload.channelPassword);
            if ((await check_password).validated == false) {
                throw new HttpException('Weak password', HttpStatus.BAD_REQUEST);
            } else {
                await this.prisma.channel.update({
                    where: { id: payload.channelId },
                    data: {
                        password: (await check_password).password,
                        salt: (await check_password).salt,
                        type: payload.channelType,
                    },
                });
            }
        }

        return HttpStatus.ACCEPTED;
    }
}
