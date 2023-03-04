import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports : [UserService],
})
export class UserModule {}
