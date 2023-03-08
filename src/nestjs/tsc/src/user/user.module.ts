import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';
import { UserChannelService } from './user.channel.service';
import { UserPasswordService } from './user.password.service';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [ThrottlerModule.forRoot({
    ttl: 10,
    limit: 5,
  })],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserChannelService, UserPasswordService],
  exports : [UserService, UserChannelService, UserPasswordService],
})
export class UserModule {}
