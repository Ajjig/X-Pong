import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { InitEventDto } from '../dto/init.event.dto';
import { JoinEventDto } from '../dto/join.event.dto';
import { MoveEventDto } from '../dto/move.event.dio';
import { GameService } from './game.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: 'game',
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('join')
  handleMatchmaking(client: Socket, data: JoinEventDto): void {
    this.gameService.handleMatchmaking(client);
  }

  @SubscribeMessage('move')
  handleMove(client: Socket, data: MoveEventDto): void {
    this.gameService.handleMove(client, data);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: string): void {
    this.gameService.handleMessage(client, data);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(client: Socket): void {
    this.gameService.handleDisconnect(client);
  }

  @SubscribeMessage('endgame')
  handleEndGame(client: Socket, data: { room: string }): void {
    this.gameService.handleEndGame(client, data);
  }

  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    const userdata = await this.gameService.getUserData(client)

    if (!userdata) {
      client.disconnect();
      return;
    }
    this.gameService.handleInit(client, userdata.username);
  }
}
