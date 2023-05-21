import {
  HttpException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Injectable()
export class AuthorisationHeaderMiddleware implements NestMiddleware {
  logger: Logger;

  constructor() {
    this.logger = new Logger('USER_MIDDLEWARE');
  }

  use(req: any, res: Response, next: NextFunction) {
    if (req.headers.authorization === undefined) {
      this.logger.warn('NO Authorisation in the header');
      throw new HttpException('NO Authorisation in the header', 401);
    }
    next();
  }
}
