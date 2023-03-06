import { Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthService } from "src/auth/auth.service";
import { DataDto } from "../dto/data.dto";
import { JoinEventDto } from "../dto/join.event.dto";
import { MoveEventDto } from "../dto/move.event.dio";

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

function makeId() {
    let result = '';
    let length = 10;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    let counter = 0;
    while (counter < length) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
      counter += 1;
    }
    return result;
}

export class Game {
    id : number;
    p1Data : DataDto;
    p2Data : DataDto;
    constructor (private readonly client1 : any, private readonly client2 : any) {
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
    }


    updatePlayerData(client : any, data : MoveEventDto) {
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

WebSocketGateway(3000, { namespace: 'game' })
export class GameGateway {

  constructor (private readonly authService : AuthService) {}

  private games = new Map<String, Game>();
  private queue = [];
  private readonly logger = new Logger('MatchMaking');



  @SubscribeMessage('join')
  async handleMatchmaking(client : any, @MessageBody() data : JoinEventDto) {
    this.queue.push({client, data});
    if (this.queue.length >= 2) {
      let p1 = this.queue.shift();
      let p2 = this.queue.shift();
      let id = makeId();
      this.games.set(id, new Game(p1.client, p2.client));
      let p1Data = await { level : 12 } // this.authService.findUserByUsername(p1.data.username);
      let p2Data = await { level : 69 } // this.authService.findUserByUsername(p2.data.username);
      p1.client.emit('match', { matchId : id, opponent : p2Data });
      p2.client.emit('match', { matchId : id, opponent : p1Data });
      this.logger.log(`Match ${id} created`);
      this.logger.log(`${p1.data.username} X ${p2.data.username}`);
    }
  }

  @SubscribeMessage('move')
  handleMove(client : any, @MessageBody() data : MoveEventDto) : void {
    try {
      this.games[data.matchId].updatePlayerData(client, data);
    }
    catch (e) {
        this.logger.error(e);
    }
  }

}