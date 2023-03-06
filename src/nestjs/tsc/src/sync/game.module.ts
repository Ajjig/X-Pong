import { Module } from "@nestjs/common";
import { GameGateway } from "./gateway/game.gateway";

@Module({
    imports: [GameGateway],
    controllers: [],
    providers: [],
  })
  
export class GameModule {}