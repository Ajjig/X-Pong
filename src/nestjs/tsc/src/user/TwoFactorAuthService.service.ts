import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserPasswordService } from './user.password.service';
import { OrigineService } from './user.validate.origine.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(private prisma: PrismaService) {}

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
          issuer: 'PingPong 1970',
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

  async disableTwoFactorAuth(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user || user.istwoFactor === false || !user.twoFactorAuthSecret) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        username: username,
      },
      data: {
        istwoFactor: false,
        twoFactorAuthSecret: null,
      },
    });
    return true;
  }
}
