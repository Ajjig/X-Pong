import { Module } from "@nestjs/common";
import { GameGateway } from "./gateway/game.gateway";

@Module({
    imports: [],
    controllers: [],
    providers: [ GameGateway ],
  })

export class GameModule {}