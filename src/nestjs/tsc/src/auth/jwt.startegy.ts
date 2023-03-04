import { PassportStrategy } from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET, // TODO: move to env
        });
    }

    async validate(payload: any) {
        // add logic 
        
        return { userId: payload.sub, 
            name: payload.name };
        }
}
