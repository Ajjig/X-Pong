import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { compare, genSalt, hash} from 'bcrypt';
import * as passwordValidator from 'password-validator';
import { stat } from 'fs';
import { channel } from 'diagnostics_channel';

export type UserPassword = {
    password: string;
    salt: string;
    validated: boolean;
}

@Injectable()
export class UserPasswordService { 
    constructor(private prisma: PrismaService)  { }
    
    async validatePassword(password: string)  : Promise<UserPassword> { 
        const schema = new passwordValidator();
        schema
            .is().min(8)                                      // Minimum length 8
            .is().max(100)                                    // Maximum length 100
            .has().uppercase()                                // Must have uppercase letters
            .has().lowercase()                                // Must have lowercase letters
            .has().digits()                                   // Must have digits
            .has().not().spaces()                             // Should not have spaces
            .is().not().oneOf(['Passw0rd', 'Password123', 'password']);    // Blacklist these values

        if (schema.validate(password)) { 
            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt);

            return {password: hashedPassword, salt: salt, validated: true};
        }
        else
        {
            return {password: password, salt: '', validated: false};
        }
    }

    async createhashPassword(password: string, salt : string) : Promise<UserPassword>
    {
        const hashedPassword = await hash(password, salt);
        return {password: hashedPassword, salt: salt, validated: true};
    }

    async checkPassword(password : string , hashedPassword : string) : Promise<boolean> { 
        const check = await compare(password, hashedPassword);
        return check;
    }




}