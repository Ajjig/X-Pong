import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameModule } from './sync/game.module';
import { AuthorisationHeaderMiddleware } from './middlewares/header.middleware';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ChatModule,
    AuthModule,
    UserModule,
    GameModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorisationHeaderMiddleware).exclude('/auth/42', '/auth/42/callback').forRoutes('*'); /// Applies middleware to all routes except /auth/*
  }
}
