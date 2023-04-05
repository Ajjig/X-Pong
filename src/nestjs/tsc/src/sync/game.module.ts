import { Module } from '@nestjs/common';
import { GameGateway } from './/gateway/game.gateway';

@Module({
  providers: [ GameGateway ],
})
export class GameModule {}