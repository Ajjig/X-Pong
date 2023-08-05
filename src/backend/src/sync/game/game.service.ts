import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JoinEventDto } from '../dto/join.event.dto';
import { MoveEventDto } from '../dto/move.event.dio';
import { makeId } from '../utils/generate.id';
import { Game } from './game';
import { Server, Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { create } from 'domain';
import { get } from 'http';
import { InvitDto } from '../dto/invit.dto';


@Injectable()
export class GameService {
  constructor(/* private readonly authService : AuthService */) {}

  private games = new Map<string, Game>();
  private queue : {client : Socket, username : string}[] = [];
  private readonly logger = new Logger('MATCH-MAKING');
  private readonly players = new Map<string, Socket>();
  private readonly invits: InvitDto[] = [];

  onModuleInit() {
    this.logger.log('GAME GATEWAY INIT');
  }

  handleMatchmaking(client: Socket): void {
    const username = this.getUserNameBySocket(client);
    this.queue.push({ username, client });
    this.logger.log(`Player ${username} waiting for an opponent`);
    if (this.queue.length >= 2) {
      let p1 = this.queue.shift();
      let p2 = this.queue.shift();
      let id = makeId(this.games);
      this.logger.log(`Match '${id}' created`);
      const game = new Game({
        id,
        client1: p1.client,
        client2: p2.client,
        player1Username: p1.username,
        player2Username: p2.username,
      });
      game.endGameCallback = this.stopGame;
      this.games.set(
        id,
        game,
      );
      game.startGame();
    }
  }

  handleCancelJoin(client: Socket): void {
    const username = this.getUserNameBySocket(client);
    this.queue = this.queue.filter((p) => p.username !== username);
    this.logger.log(`Player ${username} canceled matchmaking`);
  }

  handleMove(client: Socket, data): void {
    try {
      let game: Game = this.games.get(data.room);
      if (!game) {
        this.logger.error(`Game '${data.room}' not found`);
        return;
      }
      game.move(client, data.move);
    } catch (e) {
      this.logger.error(e);
    }
  }

  handleInvite(senderClient: Socket, data: { username: string }): void {
    if (!data.username) return;
    const senderUsername = this.getUserNameBySocket(senderClient);
    if (!senderUsername) return;
    const recieverClient = this.players.get(data.username);
    if (!recieverClient) {
      senderClient.emit('error', `Player ${data.username} is not connected`);
      return;
    }

    this.invits.push({
      from: senderUsername,
      to: data.username,
      time: new Date(),
    });
    recieverClient.emit('invite', { username: senderUsername });
    this.logger.log(`Player ${senderUsername} invited ${data.username}`);
  }

  handleAcceptInvite(recieverClient: Socket, data: { username: string }): void {
    if (!data.username) return;
    const senderClient = this.players.get(data.username);
    if (!senderClient) {
      recieverClient.emit('error', `Player ${data.username} is no longer connected`);
      return;
    }
    const recieverUsername = this.getUserNameBySocket(recieverClient);
    const invit = this.invits.find((i) => i.from === data.username && i.to === recieverUsername);
    if (!invit) {
      recieverClient.emit('error', `You have no invite from ${data.username}`);
      return;
    }

    this.invits.splice(this.invits.indexOf(invit), 1);

    const id = makeId(this.games);
    const game = new Game({
      id,
      client1: senderClient,
      client2: recieverClient,
      player1Username: data.username,
      player2Username: recieverUsername,
    });

    game.endGameCallback = this.stopGame;

    this.games.set(
      id,
      game,
    );
    game.startGame();
  }

  handleMessage(client: Socket, data: string): void {
    this.logger.log(`Message from ${client.id} : ${data}`);
  }

  handleInit(client: Socket, username: string): void {
    this.players.set(username, client);
    
    if (this.handleAlreadyInGame(username, client))
      this.logger.log(`Player ${username} reconnected to previous game`);
    else
      this.logger.log(`Player ${username} connected`);
  }
accepterUsername
  handleDisconnect(client: Socket): void {
    if (!client) return;
    let username = this.getUserNameBySocket(client);
    if (username) {
      this.players.delete(username);
      this.queue = this.queue.filter((p) => p.username !== username);
      this.logger.log(`Player ${username} disconnected`);
    }
  }

  /////////////////////////////
  getUserNameBySocket(client: Socket): string | null {
    let username: string | null = null;
    this.players.forEach((value: any, key: string) => {
      if (value === client) {
        username = key;
      }
    });
    return username;
  }

  async getUserData(client: Socket): Promise<any> {
    // get token in cookie if exist else in header
    let token = null;
    try {
      token = client.handshake.headers.cookie.split('=')[1];
      const userdecoded = jwt.verify(token, process.env.JWT_SECRET) as {
        uid: number,
        username: string,
        iat: number,
        exp: number;
      };
      return userdecoded;
    } catch {}

    try {
      const token = client.handshake.headers.jwt as string;
      if (!token) {
        return null;
      }
      const userdecoded = jwt.verify(token, process.env.JWT_SECRET) as {
        uid: number,
        username: string,
        iat: number,
        exp: number;
      };
      return userdecoded;
    } catch  {   
      return null;
    }
  }

  handleAlreadyInGame(username: string, client: Socket): boolean {
    // check if player is already in a game
    let game: Game | undefined;
    this.games.forEach((value: Game, key: string) => {
      if (value.player1Username === username || value.player2Username === username) {
        game = value;
      }
    });
    if (game) {
      game.reconnectPlayer(username, client);
      return true;
    }
    return false;
  }

  public stopGame = (id: string) => {
    const game = this.games.get(id);
    if (!game) {
      this.logger.error(`Game '${id}' cannod be stopped`);
      return;
    }
    game.stopGame();
    this.games.delete(id);
    this.logger.log(`Game '${id}' stopped`);
  }

}
