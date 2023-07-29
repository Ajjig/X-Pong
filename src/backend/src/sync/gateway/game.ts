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

import { Logger } from '@nestjs/common';
import { MoveEventDto } from '../dto/move.event.dio';
import { matter } from 'matter-js';

export class Game {
  private readonly id: string;
  private readonly player1Username: string;
  private readonly player2Username: string;
  private readonly client1: any;
  private readonly client2: any;
  private readonly logger = new Logger('GAME');

  private readonly engine = matter.Engine.create();
  private readonly world = this.engine.world;
  private readonly render = matter.Render.create({
    engine: this.engine,
    options: {
      width: 900,
      height: 500,
      wireframes: false,
    },
  });


  constructor(clientsData: any) {
    this.id = clientsData.id;
    this.player1Username = clientsData.player1Username;
    this.player2Username = clientsData.player2Username;
    this.client1 = clientsData.client1;
    this.client2 = clientsData.client2;
    // try {
    //   this.client1.join(this.id);
    //   this.client2.join(this.id);
    // } catch (e) {
    //   // console.log(e);
    // }
    this.emitMatch();
  }

  startGame() {





  }

  emitMatch() {
    this.client1
      .emit('match', {
        roomName: this.id,
        player: 1,
        opponentName: this.player2Username,
      });
    this.client2
      .emit('match', {
        roomName: this.id,
        player: 2,
        opponentName: this.player1Username,
      });
    this.logger.log(`${this.player1Username} X ${this.player2Username}`);
  }

  emitter(client: any, data: MoveEventDto): void {
    this.client1.emit('move', data);
    this.client2.emit('move', data);
    if (client === this.client1) {
      this.logger.log(`Player 1 '${this.player1Username}' moved`);
    } else {
      this.logger.log(`Player 2 '${this.player2Username}' moved`);
    }
  }
}
