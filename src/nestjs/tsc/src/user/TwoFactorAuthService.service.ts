import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { UserPasswordService } from './user.password.service';
import { OrigineService } from './user.validate.origine.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private prisma: PrismaService,
    private UserPasswordService: UserPasswordService,
    private OrigineService: OrigineService,
  ) {}

  generateSecret(): string {
    const secret = speakeasy.generateSecret({ length: 20 });
    return secret.base32;
  }

  async generateQRCodeUrl(username: string, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(
        speakeasy.otpauthURL({
          secret: secret,
          label: username,
          issuer: 'Your App Name',
        }),
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        },
      );
    });
  }

  async verifyToken(username: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user || user.istwoFactor === false || !user.twoFactorAuthSecret) {
      return false;
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuthSecret,
      encoding: 'base32',
      token: code,
    });
    return verified;
  }

  async enableTwoFactorAuth(username: string): Promise<string | boolean> {
    // check if user enabled 2FA
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user.istwoFactor) {
      return false;
    } else {
      const secret = this.generateSecret();
      const qrCodeUrl = await this.generateQRCodeUrl(username, secret);
      await this.prisma.user.update({
        where: {
          username: username,
        },
        data: {
          istwoFactor: true,
          twoFactorAuthSecret: secret,
        },
      });
      return qrCodeUrl;
    }
  }
}
