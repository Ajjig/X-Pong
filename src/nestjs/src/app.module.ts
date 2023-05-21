import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GameModule } from './sync/game.module';
import { AuthorisationHeaderMiddleware } from './middlewares/header.middleware';

@Module({
  imports: [
    ChatModule,
    AuthModule,
    UserModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorisationHeaderMiddleware)
      .forRoutes(
        '/user/set*',
        '/user/get*',
        '/chat/set*',
        '/chat/get*',
        '/game/set*',
        '/game/get*',
      );
  }
}
