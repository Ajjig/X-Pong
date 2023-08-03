import { Module } from '@nestjs/common';
import { GameGateway } from './gateway/game.gateway';
import { Game } from './game/game';
import { GameService } from './game/game.service';

@Module({
  providers: [GameGateway, GameService],
})
export class GameModule {}
