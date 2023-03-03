import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    @Get('42')
    @UseGuards(AuthGuard('42'))
    async fortyTwoAuth(@Req() req) {}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async fortyTwoAuthCallback(@Req() req) {
        return req.user;
    }
}
