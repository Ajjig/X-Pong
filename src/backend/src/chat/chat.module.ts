import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../prisma.service';
import { JwtUnauthorizedFilter } from '../exceptions/ws.exception.catch';
import { AuthModule } from '../auth/auth.module';
import { PublicChannelService } from './publicchannel.service';
import { UserChatHistoryService } from './user.chat.history.service';

@Module({
  imports: [AuthModule],
  providers: [
    ChatGateway,
    ChatService,
    PrismaService,
    JwtUnauthorizedFilter,
    PublicChannelService,
    UserChatHistoryService,
  ],
})
export class ChatModule {}
