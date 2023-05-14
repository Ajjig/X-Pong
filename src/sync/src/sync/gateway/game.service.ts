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

import { Logger } from "@nestjs/common";
import { MoveEventDto } from "../dto/move.event.dio";


export class GameService {
    private readonly id : string;
    private readonly player1Username : string;
    private readonly player2Username : string;
    private readonly client1 : any;
    private readonly client2 : any;
    private readonly logger = new Logger('GAME-SERVICE');

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
        this.logger.log(`${this.player1Username} X ${this.player2Username}`);
      }

    emitter(client : any, data: MoveEventDto) : void {
      if (client === this.client1) {
          this.logger.log(`Player 1 '${this.player1Username}' moved`);
          this.client1.to(this.id).emit('move', data.data);
        }
        else {
          this.logger.log(`Player 2 '${this.player2Username}' moved`);
          this.client2.to(this.id).emit('move', data.data);
        }
    }

}