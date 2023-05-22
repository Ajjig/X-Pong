import { Catch, ArgumentsHost } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(WsException)
export class JwtUnauthorizedFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    client.emit('error', {
      status: 'error',
      message: 'Unauthorized',
    });
  }
}
