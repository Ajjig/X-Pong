import { Module } from "@nestjs/common";
import { MatchmakingGateway, GameGateway } from "./game.gateway";

@Module({
    providers: [GameGateway, MatchmakingGateway]
  })
  export class GameModule {}