import { Module } from '@nestjs/common';
import { GameGateway } from './gateway/game.gateway';
import { Game } from './gateway/game';
import { GameService } from './gateway/game.service';

@Module({
  providers: [GameGateway, GameService],
})
export class GameModule {}
