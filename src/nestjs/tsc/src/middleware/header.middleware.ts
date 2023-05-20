import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";


@Injectable()
export class AuthorisationHeaderMiddleware implements NestMiddleware{
    logger: Logger;

    constructor() { this.logger = new Logger('USER_MIDDLEWARE'); }

    use(req: any, res: Response, next: NextFunction) {
        if (req.headers.authorization === undefined) {
            this.logger.error('NO Authorisation in the header');
            res.status(401).send('NO Authorisation in the header');
            return;
        }
        next();
    }
}