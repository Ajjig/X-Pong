import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth(@Req() req) {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthCallback(@Req() req) {
    return this.AuthService.login(req.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req) {
    return this.AuthService.login(req.user);
  }
}
