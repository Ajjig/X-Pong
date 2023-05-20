import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AuthService } from "./auth.service";
import * as dotenv from 'dotenv';

dotenv.config();


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    logger : Logger;
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.clientID,
            clientSecret: process.env.clientSecret,
            callbackURL: process.env.callbackURL,
        });
        this.logger = new Logger('FORTY-TWO-STRATEGY');
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const user = await this.authService.findOrCreateUser(profile);
        if (user == undefined || user == null) {
            throw new BadRequestException();
        }
        done(null, user);
    }
}