import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { EventModel } from "./event.model";

@WebSocketGateway(6969, { namespace: 'game' })

export class GameGateway {
  constructor() {}

  @SubscribeMessage('game')
    handleGameEvent(@MessageBody() data: EventModel) : void {
    console.log('game event', data);
  }
}