import {
  HttpException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class AuthorisationHeaderMiddleware implements NestMiddleware {
  logger: Logger;

  constructor() {
    this.logger = new Logger('HEADER_MIDDLEWARE');
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization === undefined) {
      const jwt = req.cookies.jwt;
      if (jwt) {
        req.headers['authorization'] = `Bearer ${jwt}`;
        next();
        return;
      }
      this.logger.warn('NO Authorisation in the header');
      throw new HttpException('NO Authorisation in the header', 401);
    }
    next();
  }

}
