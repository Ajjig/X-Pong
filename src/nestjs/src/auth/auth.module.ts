import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './42.startegy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.startegy';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: '42' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // TODO: move to env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [FortyTwoStrategy, AuthService, PrismaService, JwtStrategy],

  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
