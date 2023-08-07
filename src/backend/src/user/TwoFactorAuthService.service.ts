import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserPasswordService } from './user.password.service';
import { OrigineService } from './user.validate.origine.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(private prisma: PrismaService) {}

  generateSecret(): any {
    const secret = speakeasy.generateSecret({ length: 20 });
    return secret;
  }

  async generateQRCodeUrl(username: string, secret: any): Promise<string> {
    // const otpAuthUrl = speakeasy.otpauthURL({
    //   secret: secret.base32,
    //   label: username,
    //   issuer: 'SKYPONG TM',
    // });
    let qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
  
    return qrCodeUrl;
  }

  async verifyToken(userId: number, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || user.istwoFactor === false || !user.twoFactorAuthSecret) {
      throw new HttpException('2FA is not enabled for this user', HttpStatus.BAD_REQUEST);
    }
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuthSecret,
      encoding: 'base32',
      token: code,
    });
    return verified;
  }

  async enableTwoFactorAuth(userId: number): Promise<string | boolean> {
    // check if user enabled 2FA
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user.istwoFactor) {
      return false;
    } else {
      const secret = this.generateSecret();
      const qrCodeUrl = await this.generateQRCodeUrl(user.username, secret);
      await this.prisma.user.update({
        where: {
          username: user.username,
        },
        data: {
          istwoFactor: true,
          twoFactorAuthSecret: secret.base32,
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
