import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './sync/game.module';
import { GameService } from './sync/gateway/game.service';

@Module({
  imports: [ GameModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
