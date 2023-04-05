import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';
import { UserChannelService } from './user.channel.service';
import { UserPasswordService } from './user.password.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { OrigineService } from './user.validate.origine.service';
import { InfoUserService } from './info.user.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    UserChannelService,
    UserPasswordService,
    OrigineService,
    InfoUserService,
  ],
  exports: [
    UserService,
    UserChannelService,
    UserPasswordService,
    OrigineService,
    InfoUserService,
  ],
})
export class UserModule {}
