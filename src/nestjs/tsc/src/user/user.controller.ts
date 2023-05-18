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
  Logger,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { UserChannelService } from './user.channel.service';
import { InfoUserService } from './info.user.service';
import { TwoFactorAuthService } from './TwoFactorAuthService.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UpdateUsernameDto } from './dto/update.username.dto';
import { FriendDto } from './dto/friend.dto';
import { CreateChannelDto } from './dto/create.channel.dto';
import { Prisma } from '.prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly UserChannelService: UserChannelService,
    private readonly InfoUserService: InfoUserService,
    private readonly TwoFactorAuthService: TwoFactorAuthService,
    private readonly UploadService: UploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/set_username') // change username
  async setProfileUsernameByusername(
    @Req() request: any,
    @Body() body: UpdateUsernameDto,
  ): Promise<HttpException> {
    if (!body || !request.user.username || !body.new_username) {
      throw new HttpException('Missing username or name', 400);
    }
    return this.userService.setProfileUsernameByusername(
      request.user.username,
      body.new_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_confirmed')
  async setProfileConfirmedByUsername(@Req() request: any) {
    if (!request.user.username) {
      throw new BadRequestException();
    }
    return this.userService.setProfileConfirmedByUsername(
      request.user.username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_stats')
  async setProfileStatsByUsername(@Req() request: any, @Body() body: any) {
    if (!body || !request.user.username || !body.stats) {
      throw new HttpException('Missing username or stats', 400);
    }
    return this.userService.setProfileStatsByUsername(
      request.user.username,
      body.stats,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_stats')
  async getProfileStatsByUsername(@Req() request: any, @Body() body: any) {
    if (!body || !request.user.username) {
      throw new HttpException('Missing username', 400);
    }
    return this.userService.getProfileStatsByUsername(request.user.username);
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
  async getUserDataByUsername(@Req() request: any, @Param('username') username: string) {
    if (!username) {
      throw new BadRequestException('Missing username');
    }
    return this.userService.getUserDataByUsername(username, request.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/add_friend')
  async addFriendByUsername(@Req() request: any, @Body() body: FriendDto) {
    if (!body || !request.user.username || !body.friend_username) {
      throw new HttpException('Missing username or friend_username', 400);
    }
    return this.userService.addFriendByUsername(
      request.user.username,
      body.friend_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/accept_friend_request')
  async acceptFriendRequestByUsername(@Req() request: any, @Body() body: FriendDto) {
    if (!body || !body.friend_username) {
      throw new HttpException('Missing username or friend_username', 400);
    }
    return this.userService.acceptFriendRequestByUsername(
      request.user.username,
      body.friend_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/block_friend')
  async blockFriendByUsername(@Req() request: any, @Body() body: FriendDto) {
    if (!body || !body.friend_username) {
      throw new HttpException('Missing username or friend_username', 400);
    }
    return this.userService.blockFriendByUsername(
      request.user,
      body.friend_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/save_match')
  async saveMatchByUsername(@Req() request: any, @Body() body: any) {
    if (
      !body ||
      !request.user.username ||
      !body.result ||
      !body.opponent ||
      !body.map ||
      !body.mode
    ) {
      throw new HttpException('Missing username or match', 400);
    }
    return this.userService.saveMatchByUsername(
      request.user.username,
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_matches')
  async getMatchesByUsername(@Req() request: any, @Body() body: any) {
    if (!body || !request.user.username) {
      throw new HttpException('Missing username', 400);
    }

    return this.userService.getMatchesByUsername(request.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create_channel')
  async createChannelByUsername(@Req() request: any, @Body() body: Prisma.ChannelCreateInput) {
    if (!body || !request.user.username || !body) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.createChannelByUsername(
      request.user.username,
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_admin_of_channel')
  async setUserAsAdminOfChannelByUsername(
    @Req() request: any,
    @Body() body: any,
  ) {
    if (
      !body ||
      !request.user.username ||
      !body.channelname ||
      !body.new_admin
    ) {
      throw new HttpException('Missing username or channel', 400);
    }
    return await this.UserChannelService.setUserAsAdminOfChannelByUsername(
      request.user.username,
      body.new_admin,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_member_of_channel') // invite new user
  async setUserAsMemberOfChannelByUsername(
    @Req() request: any,
    @Body() body: any,
  ) {
    if (
      !body ||
      request.user.username ||
      !body.channelname ||
      !body.new_member
    ) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsMemberOfChannelByUsername(
      request.user.username,
      body.new_member,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/leave_channel')
  async leaveChannelByUsername(@Req() request: any, @Body() body: any) {
    if (!body || !request.user.username || !body.channelname) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.leaveChannelByUsername(
      request.user.username,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change_channel_password')
  async changeChannelPasswordByUsername(
    @Req() request: any,
    @Body() body: any,
  ) {
    if (
      !body ||
      !request.user.username ||
      !body.channelname ||
      !body.password
    ) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.changeChannelPasswordByUsername(
      request.user.username,
      body.channelname,
      body.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/check_channel_password')
  async checkChannelPasswordByUsername(@Req() request: any, @Body() body: any) {
    if (
      !body ||
      !request.user.username ||
      !body.channelname ||
      !body.password
    ) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.checkChannelPasswordByUsername(
      request.user.username,
      body.channelname,
      body.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/remove_channel_password')
  async removechannelpasswordByUsername(
    @Req() request: any,
    @Body() body: any,
  ) {
    if (!body || !request.user.username || !body.channelname) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.removeChannelPasswordByUsername(
      request.user.username,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_banned_of_channel')
  async setUserAsBannedOfChannelByUsername(
    @Req() request: any,
    @Body() body: any,
  ) {
    if (
      !body ||
      request.user.username ||
      !body.channelname ||
      !body.new_banned
    ) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsBannedOfChannelByUsername(
      request.user.username,
      body.new_banned,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_kicked_of_channel')
  async setUserAsKickedOfChannelByUsername(
    @Req() request: any,
    @Body() body: any,
  ) {
    if (!body || !body.channelname || !body.new_kicked) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsKickedOfChannelByUsername(
      request.user,
      body.new_kicked,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_muted_of_channel')
  async setUserAsMutedOfChannelByUsername(@Req() request, @Body() body: any) {
    if (!body || !body.channelname || !body.new_muted) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsMutedOfChannelByUsername(
      request.user,
      body.new_muted,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_unmuted_of_channel')
  async setUserAsUnmutedOfChannelByUsername(@Req() request, @Body() body: any) {
    if (!body || !body.channelname || !body.new_unmuted) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsUnmutedOfChannelByUsername(
      request.user,
      body.new_unmuted,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_unbanned_of_channel')
  async setUserAsUnbannedOfChannelByUsername(
    @Req() request,
    @Body() body: any,
  ) {
    if (!body || !body.channelname || !body.new_unbanned) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsUnbannedOfChannelByUsername(
      request.user,
      body.new_unbanned,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_unkicked_of_channel')
  async setUserAsUnkickedOfChannelByUsername(
    @Req() request,
    @Body() body: any,
  ) {
    if (!body || !body.channelname || !body.new_unkicked) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsUnkickedOfChannelByUsername(
      request.user,
      body.new_unkicked,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_any_user_info')
  async get_any_user_info(@Req() request, @Body() body: any) {
    if (!body || !request.user.username || !body.username) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.InfoUserService.get_any_user_info(body.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/setup_2fa')
  async setup_2fa(@Req() request) {
    if (!request.user.username) {
      throw new HttpException('Missing username', 400);
    }
    const user = await this.TwoFactorAuthService.enableTwoFactorAuth(
      request.user.username,
    );
    if (user == false) {
      throw new HttpException('User already enabled 2FA', 400);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verify_2fa')
  async verify_2fa(@Req() request, @Body() body: any) {
    if (!body || !request.user.username || !body.code) {
      throw new HttpException('Missing username or code', 400);
    }
    const user = await this.TwoFactorAuthService.verifyToken(
      request.user.username,
      body.code,
    );
    if (user == false) {
      throw new HttpException('Invalid code or User 2FA Disabled', 400);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/disable_2fa')
  async disable_2fa(@Req() request) {
    if (!request.user.username) {
      throw new HttpException('Missing username', 400);
    }
    const user = await this.TwoFactorAuthService.disableTwoFactorAuth(
      request.user.username,
    );
    if (user == false) {
      throw new HttpException('User already disabled 2FA', 400);
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
    if (!request.user.username) {
      throw new HttpException('Missing username', 400);
    }
    const path = await this.UploadService.uploadFile(file);
    await this.UploadService.updateUserAvatar(request.user.username, path);
    return path;
  }
}
