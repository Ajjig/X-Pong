import { Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class JwtUnauthorizedFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    client.emit('error', {
      message: 'Unauthorized Exception',
    });
  }
}
