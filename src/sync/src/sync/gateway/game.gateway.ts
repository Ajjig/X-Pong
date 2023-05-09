import { Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Socket } from "socket.io-client"
import { DataDto } from "../dto/data.dto";
import { InitEventDto } from "../dto/init.event.dto";
import { JoinEventDto } from "../dto/join.event.dto";
import { MoveEventDto } from "../dto/move.event.dio";
import { makeId } from "../utils/generate.id";

// export type UserFilted = {
//
//   id: number;
//   email: string;
//   name: string;
//   username: string | null;
//   avatarUrl: string;
//   onlineStatus: string;
//   blockedUsernames: string[];
//   createdAt: Date;
//   updatedAt: Date;
//
// };


export class Game {
    id : string;
    player1Username : string;
    player2Username : string;
    client1 : any;
    client2 : any;

    constructor ( data : any ) {
        this.id = data.id;
        this.player1Username = data.player1Username;
        this.player2Username = data.player2Username;
        this.client1 = data.client1;
        this.client2 = data.client2;
        try {
          this.client1.join(this.id);
          this.client2.join(this.id);
        } catch (e) {
          // console.log(e);
        }
        this.emitMatch();
    }

    emitMatch() {
        this.client1.to(this.id).emit('match', { roomName : this.id, player : 1, opponentName : this.player2Username });
        this.client2.to(this.id).emit('match', { roomName : this.id, player : 2, opponentName : this.player1Username });
    }

    emitter(client : any, data: MoveEventDto) : void {
        if (client === this.client1) {
          this.client2.to(this.id).emit('move', data.data);
        }
        else {
          this.client1.to(this.id).emit('move', data.data);
        }
    }

}

@WebSocketGateway(3001)
export class GameGateway {

  constructor (/* private readonly authService : AuthService */) {}

  private games = new Map<string, Game>();
  private queue = [];
  private readonly logger = new Logger('MATCH-MAKING');
  private readonly players = new Map<string, any>();

  onModuleInit() {
    this.logger.log('GAME GATEWAY INIT');
  }

  @WebSocketServer() server : Server;

  @SubscribeMessage('join')
  handleMatchmaking(client : Socket, data : JoinEventDto) : void {
    this.queue.push({ client, data });
    this.logger.log(`Player ${data.username} waiting for an opponent`);
    if (this.queue.length >= 2) {
      let p1 = this.queue.shift();
      let p2 = this.queue.shift();
      let id = makeId(this.games);
      this.logger.log(`Match '${id}' created`);
      this.logger.log(`${p1.data.username} X ${p2.data.username}`);
      this.games.set(id, new Game({
        id,
        client1 : p1.client,
        client2 : p2.client,
        player1Username : p1.data.username,
        player2Username : p2.data.username
      }));
    }
  }

  @SubscribeMessage('move')
  handleMove(client : Socket, data : MoveEventDto) : void {
    try {
      let game : Game = this.games.get(data.room);
      this.logger.log(typeof game);
      game.emitter(client, data);
    }
    catch (e) {
      this.logger.error(e);
    }
  }

  @SubscribeMessage('message')
  handleMessage(client : Socket, data : string) : void {
    this.logger.log(`Message from ${client.id} : ${data}`);
  }

  @SubscribeMessage('init')
  handleInit(client : Socket, data : InitEventDto) : void {
    this.players.set(data.username, client);
    this.logger.log(`Player ${data.username} connected to the game`);
  }

  /////////////////////////////
  getUserName(client) : string {
    let username : string;
    this.players.forEach((value : any, key : string) => {
      if (value === client) {
        username = key;
      }
    });
    if (username) {
      return username;
    } else {
      return 'Unknown';
    }
  }

}