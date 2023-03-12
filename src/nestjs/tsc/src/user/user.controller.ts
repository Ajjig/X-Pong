import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { UserChannelService } from './user.channel.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly UserChannelService: UserChannelService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/set_picture')
  async setProfilePictureByUsername(@Body() body: any) {
    if (!body || !body.username || !body.avatarUrl) {
      throw new HttpException('Missing username or avatarUrl', 400);
    }
    return this.userService.setProfilePictureByUsername(
      body.username,
      body.avatarUrl,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_username')
  async setProfileUsernameByusername(
    @Body() body: any,
  ): Promise<HttpException> {
    if (!body || !body.username || !body.new_username) {
      throw new HttpException('Missing username or name', 400);
    }
    return this.userService.setProfileUsernameByusername(
      body.username,
      body.new_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_confirmed')
  async setProfileConfirmedByUsername(@Body() body: any) {
    if (!body || !body.username) {
      throw new HttpException('Missing username', 400);
    }
    return this.userService.setProfileConfirmedByUsername(body.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_stats')
  async setProfileStatsByUsername(@Body() body: any) { 
    if (!body || !body.username || !body.stats) {
      throw new HttpException('Missing username or stats', 400);
    }
    return this.userService.setProfileStatsByUsername(body.username, body.stats);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_stats')
  async getProfileStatsByUsername(@Body() body: any) { 
    if (!body || !body.username) {
      throw new HttpException('Missing username', 400);
    }
    return this.userService.getProfileStatsByUsername(body.username);
  }


  @UseGuards(JwtAuthGuard)
  @Get('/get_userdata')
  async getUserDataByUsername(@Body() body: any) {
    if (!body || !body.username) {
      throw new HttpException('Missing username', 400);
    }
    return this.userService.getUserDataByUsername(body.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add_friend')
  async addFriendByUsername(@Body() body: any) {
    if (!body || !body.username || !body.friend_username) {
      throw new HttpException('Missing username or friend_username', 400);
    }
    return this.userService.addFriendByUsername(
      body.username,
      body.friend_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/accept_friend_request')
  async acceptFriendRequestByUsername(@Body() body: any) { 
    if (!body || !body.username || !body.friend_username) {
      throw new HttpException('Missing username or friend_username', 400);
    }
    return this.userService.acceptFriendRequestByUsername(
      body.username,
      body.friend_username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/save_match')
  async saveMatchByUsername(@Body() body: any) { 
    if (!body || !body.username || !body.match) {
      throw new HttpException('Missing username or match', 400);
    }
    return this.userService.saveMatchByUsername(body.username, body.match);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_matches')
  async getMatchesByUsername(@Body() body: any) {
    if (!body || !body.username) {
      throw new HttpException('Missing username', 400);
    }
    return this.userService.getMatchesByUsername(body.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create_channel')
  async createChannelByUsername(@Body() body: any) { 
    if (!body || !body.username || !body.channel) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.createChannelByUsername(body.username, body.channel);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_admin_of_channel')
  async setUserAsAdminOfChannelByUsername(@Body() body: any) { 
    if (!body || !body.admin || !body.channelname || !body.new_admin) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsAdminOfChannelByUsername(
      body.admin,
      body.new_admin,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_member_of_channel')
  async setUserAsMemberOfChannelByUsername(@Body() body: any) { 
    if (!body || !body.admin || !body.channelname || !body.new_member) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsMemberOfChannelByUsername(
      body.admin,
      body.new_member,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change_channel_password')
  async changeChannelPasswordByUsername(@Body() body: any) { 
    if (!body || !body.admin || !body.channelname || !body.password) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.changeChannelPasswordByUsername(
      body.admin,
      body.channelname,
      body.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/check_channel_password')
  async checkChannelPasswordByUsername(@Body() body: any) {
    if (!body || !body.username || !body.channelname || !body.password) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.checkChannelPasswordByUsername(
      body.username,
      body.channelname,
      body.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/remove_channel_password')
  async removechannelpasswordByUsername(@Body() body: any) { 
    if (!body || !body.username || !body.channelname) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.removeChannelPasswordByUsername(
      body.username,
      body.channelname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_user_as_banned_of_channel')
  async setUserAsBannedOfChannelByUsername(@Body() body: any) {
    if (!body || !body.admin || !body.channelname || !body.new_banned) {
      throw new HttpException('Missing username or channel', 400);
    }
    return this.UserChannelService.setUserAsBannedOfChannelByUsername(
      body.admin,
      body.new_banned,
      body.channelname,
    );
  }
}
