import { Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Socket } from "socket.io-client"
import { DataDto } from "../dto/data.dto";
import { InitEventDto } from "../dto/init.event.dto";
import { JoinEventDto } from "../dto/join.event.dto";
import { MoveEventDto } from "../dto/move.event.dio";
import { makeId } from "../utils/generate.id";
import { Game } from "./game";
import { GameService } from "./game.service";



@WebSocketGateway(3001)
export class GameGateway {

  constructor (private readonly gameService : GameService) {}


  @WebSocketServer() server : Server;

  @SubscribeMessage('join')
  handleMatchmaking(client : Socket, data : JoinEventDto) : void {
    this.gameService.handleMatchmaking(client, data);
  }

  @SubscribeMessage('move')
  handleMove(client : Socket, data : MoveEventDto) : void {
    this.gameService.handleMove(client, data);
  }

  @SubscribeMessage('message')
  handleMessage(client : Socket, data : string) : void {
    this.gameService.handleMessage(client, data);
  }

  @SubscribeMessage('init')
  handleInit(client : Socket, data : InitEventDto) : void {
    this.gameService.handleInit(client, data);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(client : Socket) : void {
    this.gameService.handleDisconnect(client);
  }

  @SubscribeMessage('endgame')
  handleEndGame(client : Socket, data : { room : string }) : void {
    this.gameService.handleEndGame(client, data);
  }

}