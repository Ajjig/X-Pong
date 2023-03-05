import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthService } from "src/auth/auth.service";

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

@WebSocketGateway(3000, { namespace: 'game' })
export class GameGateway {
  constructor (private readonly p1 : any, private readonly p2 : any) {}

  @SubscribeMessage('move')
  handleMove(client, @MessageBody() data: any) {
    console.log(data);
    if (client === this.p1) {
      this.p2.emit('move', data);
    } else {
      this.p1.emit('move', data);
    }
  }
}

WebSocketGateway(3000, { namespace: 'matchmaking' })
export class MatchmakingGateway {
  constructor (private readonly authService : AuthService) {}
  // private readonly games = new Map<number, GameGateway>();
  private queue = [];


  @SubscribeMessage('join')
  handleJoin(client : any, @MessageBody() data: JoinEventDto) {
    this.queue.push({client, data});
    if (this.queue.length === 2) {
      const p1 = this.queue.shift();
      const p2 = this.queue.shift();
      p1.client.emit('start', {
        opponent: this.authService.findUserByUsername(p2.data.username),
      });
      p2.client.emit('start', {
        
      });
    }
  }
}