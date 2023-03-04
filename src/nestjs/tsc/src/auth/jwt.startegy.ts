import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth.service';

dotenv.config();

export type UserFilted = {
  id: number;
  email: string;
  name: string;
  username: string | null;
  avatarUrl: string;
  onlineStatus: string;
  blockedUsernames: string[];
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, private AuthService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<UserFilted> {
    return this.AuthService.findUserByUsername(payload.username);
  }
}
