import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth(@Req() req) {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.AuthService.login(req.user, res);
  }
}
