import { Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Socket } from "socket.io-client"
import { DataDto } from "../dto/data.dto";
import { InitEventDto } from "../dto/init.event.dto";
import { JoinEventDto } from "../dto/join.event.dto";
import { MoveEventDto } from "../dto/move.event.dio";
import { makeId } from "../utils/generate.id";
import { GameService } from "./game.service";



@WebSocketGateway(3001)
export class GameGateway {

  constructor (/* private readonly authService : AuthService */) {}

  private games = new Map<string, GameService>();
  private queue = [];
  private readonly logger = new Logger('MATCH-MAKING');
  private readonly players = new Map<string, Socket>();

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
      this.games.set(id, new GameService({
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
      let game : GameService = this.games.get(data.room);
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

  @SubscribeMessage('disconnect')
  handleDisconnect(client : Socket) : void {
    let username = this.getUserNameBySocket(client);
    if (username) {
      this.players.delete(username);
      this.logger.log(`Player ${username} disconnected`);
    }
  }

  @SubscribeMessage('endgame')
  handleEndGame(client : Socket, data : { room : string }) : void {
    if (!data || !data.room) return;

    const isRemoved = this.games.delete(data.room);
    if (isRemoved) {
      this.logger.log(`Match '${data.room}' ended`);
    }
  }

  /////////////////////////////
  getUserNameBySocket(client: Socket) : string | null {
    let username : string | null = null;
    this.players.forEach((value : any, key : string) => {
      if (value === client) {
        username = key;
      }
    });
    return username;
  }

}