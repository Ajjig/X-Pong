import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ChatModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],

    
})
export class AppModule {}
