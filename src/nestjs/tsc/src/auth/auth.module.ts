import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './42.startegy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './prisma.service';

@Module({
  imports:[ PassportModule.register({ defaultStrategy: '42' }), ],
  providers: [FortyTwoStrategy, AuthService, PrismaService, ],

  controllers: [AuthController]
})
export class AuthModule {}
