import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Param,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Logger,
  Res,
  NotFoundException,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { UserChannelService } from './user.channel.service';
import { InfoUserService } from './info.user.service';
import { TwoFactorAuthService } from './TwoFactorAuthService.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UpdateUsernameDto } from './dto/update.username.dto';
import { FriendDto, BlockFriendDto } from './dto/friend.dto';
import { Prisma } from '.prisma/client';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UpdateAdminChannelDto } from './dto/update.admin.channel.dto';
import { AddMemberChannelDto } from './dto/add.member.channel.dto';
import { LeaveChannelDto } from './dto/leave.channel.dto';
import { UpdatePasswordChannelDto } from './dto/update.password.channel.dto';
import { CheckChannelPasswordDto } from './dto/check.channel.password.dto';
import { RemoveChannelPasswordDto } from './dto/remove.channel.password.dto';
import { BanMemberChannelDto } from './dto/ban.member.channel.dto';
import { KickMemberChannelDto } from './dto/kick.member.channel.dto';
import { MuteMemberChannelDto } from './dto/mute.member.channel.dto';
import { joinPublicChannelDto } from '../chat/dto/create-chat.dto';
import { MuteJob } from './jobs/mute.job';
import { SetUserAsAdminDto } from './dto/set.user.as.admin.dto';
import { CreateChannelPayloadDto } from './dto/create.channel.payload.dto';
import { RemoveAdminDto } from './dto/remove.admin.dts';
import { UpdateChannelDto } from './dto/update.channel.dto';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly UserChannelService: UserChannelService,
    private readonly InfoUserService: InfoUserService,
    private readonly TwoFactorAuthService: TwoFactorAuthService,
    private readonly UploadService: UploadService,
    private readonly authService: AuthService,
    private readonly muteJob: MuteJob,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Res() res: Response) {
    res.redirect('/user/profile');
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:uid')
  async getUserById(@Req() request: any, @Param('uid') uid: string) {
    const user = await this.authService.findUserById(
      request.user.username,
      uid,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/set_username') // change username
  async setProfileUsernameByusername(
    @Req() request: any,
    @Body() body: UpdateUsernameDto,
    @Res() res: Response,
  ) {
    const isUpdates = this.userService.setProfileUsernameByusername(
      request.user.username,
      body.new_username,
    );
    if (isUpdates) {
      request.user.username = body.new_username;
      return this.authService.updateProfileAndToken(request.user, res);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_confirmed')
  async setProfileConfirmedByUsername(@Req() request: any) {
    if (!request.user.username) {
      throw new BadRequestException('Missing username');
    }
    return this.userService.setProfileConfirmedByUsername(
      request.user.username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_stats/:id')
  async getProfileStatsByUsername(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!request.user.username) {
      throw new HttpException('Missing username', HttpStatus.BAD_REQUEST);
    }
    return this.userService.getProfileStatsByID(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() request: any) {
    if (!request.user.username) {
      throw new BadRequestException('Missing username');
    }
    const username = request.user.username;
    return this.userService.getUserDataByUsername(username, username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username')
  async getUserDataByUsername(
    @Req() request: any,
    @Param('username') username: string,
  ) {
    if (!username) {
      throw new BadRequestException('Missing username');
    }
    return await this.userService.getUserDataByUsername(
      username,
      request.user.username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/add_friend')
  async addFriendByUsername(@Req() request: any, @Body() body: FriendDto) {
    if (!body || !request.user.username || !body.friend_username) {
      throw new HttpException(
        'Missing username or friend_username',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.addFriendByUsername(
      request.user.username,
      body.friend_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/accept_friend_request')
  async acceptFriendRequestByUsername(
    @Req() request: any,
    @Body() body: FriendDto,
  ) {
    if (!body || !body.friend_username) {
      throw new HttpException(
        'Missing username or friend_username',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.acceptFriendRequestByUsername(
      request.user.username,
      body.friend_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/block_friend')
  async blockFriendByUsername(
    @Req() request: any,
    @Body() body: BlockFriendDto,
  ) {
    if (!body || !body.friendID) {
      throw new HttpException(
        'Missing username or friend_username',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.blockFriendByUsername(
      request.user.id,
      body.friendID,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username/matches')
  async getMatchesByUsername(
    @Req() request: any,
    @Param('username') username: string,
  ) {
    if (!request.user.username || !username) {
      throw new HttpException('Missing username', HttpStatus.BAD_REQUEST);
    }

    return this.userService.getMatchesByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/create_channel')
  async createChannelByUsername(
    @Req() request: any,
    @Body() body: CreateChannelPayloadDto,
  ) {
    if (!body || !request.user.id) {
      throw new HttpException(
        'Missing username or channel',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.UserChannelService.createChannelByUsername(
      request.user.id,
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/set_user_as_admin_of_channel')
  async setUserAsAdminOfChannelByUsername(
    @Req() request: any,
    @Body() body: SetUserAsAdminDto,
  ) {
    return await this.UserChannelService.setUserAsAdminOfChannelByUsername(
      request.user.id,
      body.newAdminId,
      body.channelId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/set_user_as_member_of_channel') // invite new user
  async setUserAsMemberOfChannelByID(
    @Req() request: any,
    @Body() body: AddMemberChannelDto,
  ) {
    return this.UserChannelService.setUserAsMemberOfChannelByID(
      request.user.id,
      body.new_memberID,
      body.channelId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/leave_channel')
  async leaveChannelByUsername(
    @Req() request: any,
    @Body() body: LeaveChannelDto,
  ) {
    return this.UserChannelService.leaveChannelByUsername(
      request.user.id,
      body.channelId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/change_channel_password')
  async changeChannelPasswordByUsername(
    @Req() request: any,
    @Body() body: UpdatePasswordChannelDto,
  ) {
    return this.UserChannelService.changeChannelPasswordByUsername(
      request.user.id,
      body.channelId,
      body.new_password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/check_channel_password')
  async checkChannelPasswordByUsername(
    @Req() request: any,
    @Body() body: CheckChannelPasswordDto,
  ) {
    return this.UserChannelService.checkChannelPasswordByUsername(
      request.user.username,
      body.channel_name,
      body.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/remove_channel_password')
  async removechannelpasswordByUsername(
    @Req() request: any,
    @Body() body: RemoveChannelPasswordDto,
  ) {
    return this.UserChannelService.removeChannelPasswordByUsername(
      request.user.id,
      body.channelId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/set_user_as_banned_of_channel')
  async setUserAsBannedOfChannelByUsername(
    @Req() request: any,
    @Body() body: BanMemberChannelDto,
  ) {
    return this.UserChannelService.setUserAsBannedOfChannelByUsername(
      request.user.id,
      body.BannedId,
      body.channelId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/set_user_as_kicked_of_channel')
  async setUserAsKickedOfChannelByUsername(
    @Req() request: any,
    @Body() body: KickMemberChannelDto,
  ) {
    return this.UserChannelService.setUserAsKickedOfChannelByUsername(
      request.user.id,
      body.kickedId,
      body.channelId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/avatar/:id')
  async getAvatar(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    res.redirect(await this.userService.getAvatarUrlById(id));
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/set_user_as_muted_of_channel')
  async setUserAsMutedOfChannel(
    @Req() request,
    @Body() body: MuteMemberChannelDto,
  ) {
    return this.muteJob.muteUser(
      request.user.id,
      body.userId,
      body.channelId,
      body.timeoutMs || 5 * 60 * 1000,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/set_user_as_unmuted_of_channel')
  async setUserAsUnmutedOfChannel(
    @Req() request,
    @Body() body: MuteMemberChannelDto,
  ) {
    //
    return this.muteJob.unmuteUser(
      request.user.id,
      body.userId,
      body.channelId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/set_user_as_unbanned_of_channel')
  async setUserAsUnbannedOfChannelByUsername(
    @Req() request,
    @Body() body: BanMemberChannelDto,
  ) {
    return this.UserChannelService.setUserAsUnbannedOfChannelByUsername(
      request.user.id,
      body.BannedId,
      body.channelId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username/info')
  async get_any_user_info(@Req() request, @Param('username') username: string) {
    if (!username) {
      throw new HttpException('Missing username', HttpStatus.BAD_REQUEST);
    }
    return this.InfoUserService.get_any_user_info(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/setup_2fa')
  async setup_2fa(@Req() request) {
    if (!request.user.id) {
      throw new HttpException('Missing username', HttpStatus.BAD_REQUEST);
    }
    const user = await this.TwoFactorAuthService.enableTwoFactorAuth(
      request.user.id,
    );
    if (user == false) {
      throw new HttpException(
        'User already enabled 2FA',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  @Post('/verify_2fa')
  async verify_2fa(@Req() request, @Body() body: any, @Res() res: Response) {
    if (!body || !request.user.id || !body.code) {
      throw new HttpException(
        'Missing username or code',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const user = await this.TwoFactorAuthService.verifyToken(request.user.id, body.code);
      if (user == true) {
        const payload = {
          username: request.user.username,
          uid: request.user.id,
          is2f: false,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie('jwt', token, { httpOnly: false, path: '/' });
        res.redirect(process.env.FRONTEND_REDIRECT_LOGIN_URL);

      } else {

        throw new HttpException(
          'Invalid code or User 2FA Disabled',
          HttpStatus.BAD_REQUEST,
        );
      }

    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/disable_2fa')
  async disable_2fa(@Req() request) {
    if (!request.user.id) {
      throw new HttpException('Missing username', HttpStatus.BAD_REQUEST);
    }
    const user = await this.TwoFactorAuthService.disableTwoFactorAuth(
      request.user.id,
    );
    if (user == false) {
      throw new HttpException(
        'User already disabled 2FA',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() request,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!request.user.id) {
      throw new HttpException('Missing username', HttpStatus.BAD_REQUEST);
    }
    const path = await this.UploadService.uploadFile(file);
    await this.UploadService.updateUserAvatar(request.user.id, path);
    return path;
  }

  @UseGuards(JwtAuthGuard)
  @Get('public/channels')
  async getChannels(@Req() request) {
    return await this.UserChannelService.getAllPublicChannels();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/reject_friend_request')
  async rejectFriendRequestByUsername(@Req() request: any, @Body() body: any) {
    if (!body || !body.friend_username) {
      throw new HttpException(
        'Missing username or friend_username',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.rejectFriendRequestByUsername(
      request.user.username,
      body.friend_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/join_channel')
  async joinChannelByUsername(
    @Req() request: any,
    @Body() body: joinPublicChannelDto,
  ) {
    if (!body || !body.channelID) {
      throw new HttpException('Missing channel ID', HttpStatus.BAD_REQUEST);
    }
    return this.UserChannelService.joinChannelByUsername(
      request.user.username,
      body.channelID,
      body.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/channel_info/:channelID')
  async getChannelInfo(
    @Req() request: any,
    @Body() body: any,
    @Param('channelID', ParseIntPipe) channelID: number,
  ) {
    if (!body || !channelID) {
      throw new HttpException('Missing channel ID', HttpStatus.BAD_REQUEST);
    }
    return this.UserChannelService.getChannelInfo(request.user.id, channelID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/friends/list')
  async getFriends(@Req() request: any) {
    return this.userService.getFriends(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/channels/userslist/:channelID')
  async getChannelUsers(
    @Req() request: any,
    @Param('channelID', ParseIntPipe) channelID: number,
  ) {
    if (!channelID) {
      throw new HttpException('Missing channel ID', HttpStatus.BAD_REQUEST);
    }
    return this.UserChannelService.getChannelUsers(request.user.id, channelID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/remove_admin_from_channel')
  async removeAdminFromChannel(
    @Req() request: any,
    @Body() body: RemoveAdminDto,
  ): Promise<any> {
    if (!body || !body.channelId || !body.userId) {
      throw new HttpException(
        'Missing channel ID or user ID',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.UserChannelService.removeAdminFromChannel(
      request.user.id,
      body.channelId,
      body.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/channels/banned_users/:channelID')
  async getChannelBannedUsers(
    @Req() request: any,
    @Param('channelID', ParseIntPipe) channelID: number,
  ) {
    if (!channelID) {
      throw new HttpException('Missing channel ID', HttpStatus.BAD_REQUEST);
    }
    return this.UserChannelService.getChannelBannedUsers(
      request.user.id,
      channelID,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/channels/muted_users/:channelID')
  async getChannelMutedUsers(
    @Req() request: any,
    @Param('channelID', ParseIntPipe) channelID: number,
  ) {
    if (!channelID) {
      throw new HttpException('Missing channel ID', HttpStatus.BAD_REQUEST);
    }
    return this.UserChannelService.getChannelMutedUsers(
      request.user.id,
      channelID,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete_channel/:id')
  async deleteChannel(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!id) {
      throw new HttpException('Missing channel ID', HttpStatus.BAD_REQUEST);
    }
    return this.UserChannelService.deleteChannel(request.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/unblock_friend_user')
  async unblockUser(@Req() request: any, @Body() body: any) {
    if (!body || !body.friend_username) {
      throw new HttpException(
        'Missing friend_username',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.unblockUserById(
      request.user.id,
      body.friend_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/channel/update')
  async updateChannel(
    @Req() request: any,
    @Body() body: UpdateChannelDto,
  ): Promise<any> {
    if (!body) {
      throw new HttpException('Missing channel ID', HttpStatus.BAD_REQUEST);
    }
    return this.UserChannelService.updateChannel(request.user.id, body);
  }
}
