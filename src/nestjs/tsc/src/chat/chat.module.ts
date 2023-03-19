import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../prisma.service';
import { JwtUnauthorizedFilter } from './customfilter.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuardSockets } from '../auth/socket-jwt-auth.guard';

@Module({
  imports: [AuthModule],
  providers: [
    ChatGateway,
    ChatService,
    PrismaService,
    JwtUnauthorizedFilter,
    JwtAuthGuardSockets,
  ],
})
export class ChatModule {}
