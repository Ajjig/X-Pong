import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly AuthService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('login')
  async login(@Req() req) {
    return req.user;
  }
}
