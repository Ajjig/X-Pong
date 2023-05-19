import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';
import { UserChannelService } from './user.channel.service';
import { UserPasswordService } from './user.password.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { OrigineService } from './user.validate.origine.service';
import { InfoUserService } from './info.user.service';
import { TwoFactorAuthService } from './TwoFactorAuthService.service';
import { MulterModule } from '@nestjs/platform-express';
import {UploadService} from './upload.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './public/upload',
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    UserChannelService,
    UserPasswordService,
    TwoFactorAuthService,
    OrigineService,
    InfoUserService,
    UploadService,
  ],
  exports: [
    UserService,
    UserChannelService,
    UserPasswordService,
    TwoFactorAuthService,
    OrigineService,
    InfoUserService,
    UploadService,
  ],
})
export class UserModule {}
