import { Injectable, Logger } from '@nestjs/common';
import { makeId } from '../utils/generate.id';
import { Game } from './game';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { InvitDto } from '../dto/invit.dto';
import { match } from 'assert';


@Injectable()
export class GameService {
  constructor(/* private readonly authService : AuthService */) {}

  private games = new Map<string, Game>();
  private queue : {client : Socket, username : string}[] = [];
  private readonly logger = new Logger('MATCH-MAKING');
  private readonly players = new Map<string, Socket>();
  private invits: InvitDto[] = [];

  onModuleInit() {
    this.logger.log('GAME GATEWAY INIT');
  }

  async handleMatchmaking(client: Socket) {
    const username = this.getUserNameBySocket(client);

    if (!username) return;
  
    if (this.queue.find((p) => p.username === username)) {
      client.emit('error', `You are already in the queue`);
      client.emit('cancel-join', {});
      return;
    }

    if (this.isInGame(username)) {
      client.emit('error', `You are already in a game`);
      client.emit('cancel-join', {});
      return;
    }

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
        player1Id: (await this.getUserData(p1.client)).uid,
        player2Id: (await this.getUserData(p2.client)).uid,
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
      if (!game) return;
      game.move(client, data.move);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async handleInvite(senderClient: Socket, data: { username: string }) {
    if (!data.username) return;
    const senderUsername = this.getUserNameBySocket(senderClient);
    if (!senderUsername) return;
    // check if player is already in a game
    if (this.isInGame(data.username)) {
      senderClient.emit('error', `Player ${data.username} is already in a game`);
      senderClient.emit('invite-canceled', {});
      return;
    }

    if (this.isInGame(senderUsername)) {
      senderClient.emit('error', `You are already in a game`);
      senderClient.emit('invite-canceled', {});
      return;
    }

    const recieverClient = this.players.get(data.username);
    if (!recieverClient) {
      senderClient.emit('error', `Player ${data.username} is not connected`);
      senderClient.emit('invite-canceled', {});
      return;
    }

    this.invits.push({
      from: senderUsername,
      to: data.username,
      time: new Date(),
    });

    setTimeout(() => {
      this.invits = this.invits.filter((i) => i.from !== senderUsername && i.to !== data.username);
    }, 15 * 1000);
  
    const userId = (await this.getUserData(senderClient)).uid;
    recieverClient.emit('invite', { username: senderUsername, id: userId });
    this.logger.log(`Player ${senderUsername} invited ${data.username}`);
  }

  async handleAcceptInvite(recieverClient: Socket, data: { username: string }) {
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
    senderClient.emit('invite-accepted', {});
    recieverClient.emit('invite-accepted', {});
    const id = makeId(this.games);
    const game = new Game({
      id,
      client1: senderClient,
      client2: recieverClient,
      player1Username: data.username,
      player2Username: recieverUsername,
      player1Id: (await this.getUserData(senderClient)).uid,
      player2Id: (await this.getUserData(recieverClient)).uid,
    });

    game.endGameCallback = this.stopGame;

    this.games.set(
      id,
      game,
    );
    game.startGame();
  }

  handleCancelInvite(client: Socket, data: { username: string }): void {
    if (!data.username) return;
    const senderUsername = this.getUserNameBySocket(client);
    if (!senderUsername) return;
    
    this.invits = this.invits.filter((i) => i.from !== senderUsername && i.to !== data.username);
    const recieverClient = this.players.get(data.username);
    const senderClient = this.players.get(senderUsername);
    if (recieverClient) recieverClient.emit('invite-canceled', {});
    if (senderClient) senderClient.emit('invite-canceled', {});

  }

  handleRejectInvite(recieverClient: Socket, data: { username: string }): void {
    if (!data.username) return;
    const senderUsername = this.getUserNameBySocket(recieverClient);
    if (!senderUsername) return;

    this.invits = this.invits.filter((i) => i.from !== senderUsername && i.to !== data.username);
    const sendeClient = this.players.get(data.username);
    if (recieverClient) recieverClient.emit('invite-canceled', {});
    if (sendeClient) sendeClient.emit('invite-canceled', {});
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

  handleDisconnect(client: Socket): void {
    if (!client) return;
    let username = this.getUserNameBySocket(client);
    if (username) return;
    
    this.players.delete(username);
    
    this.queue = this.queue.filter((p) => p.username !== username);


    this.players[username] = null;
    this.games.forEach((game) => {
      if (game.player1Username === username) {
        game.client1 = null;
      }
      if (game.player2Username === username) {
        game.client2 = null;
      }
    });
   
    this.invits = this.invits.filter((i) => i.from !== username && i.to !== username);

  }

  /////////////////////////////
  getUserNameBySocket(client: Socket): string | null {
    let username: string | null = null;
    this.players.forEach((value: any, key: string) => {
      if (value.id === client.id) {
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
        is2f: boolean,
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
        is2f: boolean,
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

  isInGame(username: string): boolean {
    let isInGame: boolean = false;
    this.games.forEach((game) => {
      if (game.player1Username === username || game.player2Username === username) {
        isInGame = true;
      }
    });

    const isInQueue = this.queue.find((p) => p.username === username);
  
    if (isInQueue) isInGame = true;
    return isInGame;
  }

  handleLeave(client: Socket): void {
    const username = this.getUserNameBySocket(client);
    if (!username) return;
    let game: Game | undefined;
    this.games.forEach((value: Game, key: string) => {
      if (value.player1Username === username || value.player2Username === username) {
        game = value;
      }
    });
    if (!game) return;
    game.onLeaveGame(username);
  }

}
