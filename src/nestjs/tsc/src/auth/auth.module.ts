import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './42.startegy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.startegy';

@Module({
  imports:[ PassportModule.register({ defaultStrategy: '42' }), JwtModule.register ({
  secret  : 'secret', // TODO: move to env
    signOptions : { expiresIn : '60s' },
  })],
  providers: [FortyTwoStrategy, AuthService, PrismaService, JwtStrategy],

  controllers: [AuthController],
  exports : [AuthService]
 })
export class AuthModule {}
