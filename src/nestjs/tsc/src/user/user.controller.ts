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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  // @UseGuards(JwtAuthGuard)
  @Post('/set_stats')
  async setProfileStatsByUsername(@Body() body: any) { 
    if (!body || !body.username || !body.stats) {
      throw new HttpException('Missing username or stats', 400);
    }
    return this.userService.setProfileStatsByUsername(body.username, body.stats);
  }
}
