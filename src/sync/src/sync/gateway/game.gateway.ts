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
    p1Data : DataDto;
    p2Data : DataDto;
    constructor (private readonly id : string, private readonly client1 : Socket, private readonly client2 : Socket) {
        this.p1Data = {
            playerX : 0,
            playerY : 0,
            playerZ : 0,
            playerRotation : 0,
            playerHealth : 0,
            playerScore : 0,
            opponentX : 0,
            opponentY : 0,
            opponentZ : 0,
            opponentRotation : 0,
            opponentHealth : 10,
            opponentScore : 0,
        };
        this.p2Data = {
            playerX : 0,
            playerY : 0,
            playerZ : 0,
            playerRotation : 0,
            playerHealth : 0,
            playerScore : 0,
            opponentX : 0,
            opponentY : 0,
            opponentZ : 0,
            opponentRotation : 0,
            opponentHealth : 10,
            opponentScore : 0,
        }
        this.emitMatch();
    }


    emitMatch() {
        this.client1.emit('match', { matchId : this.id, opponent : this.p2Data });
        this.client2.emit('match', { matchId : this.id, opponent : this.p1Data });
    }

    updatePlayerData(client : Socket, data : MoveEventDto) {
        if (client === this.client1) {
            this.updateP1Data(data);
        } else if (client === this.client2) {
            this.updateP2Data(data);
        }
        this.emitter();
    }

    updateP1Data(data : MoveEventDto) {
        this.p1Data.playerX = data.moveX;
        this.p1Data.playerY = data.moveY;
        this.p1Data.playerZ = data.moveZ;
        this.p2Data.opponentX = data.moveX;
        this.p2Data.opponentY = data.moveY;
        this.p2Data.opponentZ = data.moveZ;
    }

    updateP2Data(data : MoveEventDto) {
        this.p2Data.playerX = data.moveX;
        this.p2Data.playerY = data.moveY;
        this.p2Data.playerZ = data.moveZ;
        this.p1Data.opponentX = data.moveX;
        this.p1Data.opponentY = data.moveY;
        this.p1Data.opponentZ = data.moveZ;
    }

    emitter() {
        this.client1.emit('data', this.p1Data);
        this.client2.emit('data', this.p2Data);
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
      this.games.set(id, new Game(id, p1.client, p2.client));
    }
  }

  @SubscribeMessage('move')
  handleMove(client : Socket, data : MoveEventDto) : void {
    try {
      this.games[data.matchId].updatePlayerData(client, data);
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

}