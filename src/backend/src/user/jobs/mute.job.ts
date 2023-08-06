import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';



@Injectable()
export class MuteJob {
  private readonly date: number = 0;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry
  )
  { }

  async muteUser(userID: number, toMuteId: number,  channelId: number, timeoutMs: number) {
    
    const channel = await  this.prismaService.channel.findUnique({
      where: {
        id: channelId
      },
      select: {
        muted: true,
        adminsIds: true,
        ownerId: true,
        members: {
          select: {
            id: true
          }
        }
      }
    });

    const isOwner = channel.ownerId === userID;
    const isAdmin = channel.adminsIds.includes(userID) && !isOwner;

    const isMember = channel.members.some(member => member.id === toMuteId);
    if (!isMember) throw new NotFoundException('User not found in channel');


    if (!channel) throw new NotFoundException('Channel not found');
    if (!isAdmin && !isOwner) throw new UnauthorizedException('You are not allowed an admin to mute users');
    if (channel.muted.some(muted => muted.id === toMuteId)) throw new ConflictException('User already muted');
    if (toMuteId === userID) throw new ConflictException('You cannot mute yourself');
    if (toMuteId === channel.ownerId) throw new ConflictException('You cannot mute the owner');
    if (isAdmin && channel.adminsIds.includes(toMuteId)) throw new UnauthorizedException('only the owner can mute admins');
    
    
    const mute = await this.prismaService.channel.update({
      where: {
        id: channelId
      },
      data: {
        muted: {
          connect: {
            id: toMuteId
          }
        }
      }
    });

    if (!mute) throw new NotFoundException('User not found in channel');


    const unmuteCallback = async () => {
      await this.prismaService.channel.update({
        where: {
          id: channelId
        },
        data: {
          muted: {
            disconnect: {
              id: toMuteId
            }
          }
        }
      });
      this.schedulerRegistry.deleteTimeout(`mute-${toMuteId}-${channelId}`);
      throw new HttpException('User unmuted', HttpStatus.ACCEPTED);
    };

    const timeoutObject = setTimeout(unmuteCallback, timeoutMs);


    this.schedulerRegistry.addTimeout(
      `mute-${toMuteId}-${channelId}`,
      timeoutObject,
    );
  
  }
  
  async unmuteUser(userID: number, toUnmuteID: number, channelId: number) {
    
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: channelId
      },
      select: {
        muted: true,
        adminsIds: true,
        ownerId: true,
        members: {
          select: {
            id: true
          }
        }
      }
    });

    const isOwner = channel.ownerId === userID;
    const isAdmin = channel.adminsIds.includes(userID) && !isOwner;
    
    const isMember = channel.members.some(member => member.id === toUnmuteID);
    if (!isMember) throw new NotFoundException('User not found in channel');

    if (!channel) throw new NotFoundException('Channel not found');
    if (!isAdmin && !isOwner) throw new UnauthorizedException('You are not allowed an admin to unmute users');
    if (!channel.muted.some(muted => muted.id === toUnmuteID)) throw new ConflictException('User not muted');
    if (toUnmuteID === userID) throw new ConflictException('You cannot unmute yourself');
    if (toUnmuteID === channel.ownerId) throw new ConflictException('You cannot unmute the owner');
    if (isAdmin && channel.adminsIds.includes(toUnmuteID)) throw new UnauthorizedException('only the owner can unmute admins');

    await this.prismaService.channel.update({
      where: {
        id: channelId
      },
      data: {
        muted: {
          disconnect: {
            id: toUnmuteID
          }
        }
      }
    });


    this.schedulerRegistry.deleteTimeout(`mute-${toUnmuteID}-${channelId}`);
    
    throw new HttpException('User unmuted', HttpStatus.ACCEPTED);
  }
}

