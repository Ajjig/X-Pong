import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class JwtAuthGuardSockets implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.token;
    if (!token) {
      return false;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };
      context.switchToWs().getData().userId = decoded.id;
      return true;
    } catch (error) {
      return false;
    }
  }
}
