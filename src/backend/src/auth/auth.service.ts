import { Injectable, HttpException, BadRequestException, Logger } from '@nestjs/common';
import { User, Prisma, PrismaClient } from '.prisma/client';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    logger: Logger;
    constructor(private prisma: PrismaService, private JwtService: JwtService) {
        this.logger = new Logger('AUTH-SERVICE');
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                username: data.username,
                Userstats: {
                    create: {
                        wins: 0,
                        losses: 0,
                        ladder: 'bronze',
                        // achievements: [],
                    },
                },
                avatarUrl: data.avatarUrl,
            },
        });
    }

    async findUserByUsername(username: string): Promise<any> {
        return this.prisma.user.findUnique({
            where: { username: username },

            select: {
                email: true,
                name: true,
                username: true,
                avatarUrl: true,
                onlineStatus: true,
                confirmed: true,
                istwoFactor: true,
                id: true,
            },
        });
    }

    async getUserById(id: number) {
        return await this.prisma.user.findUnique({
            where: { id: id },
            select: {
                email: true,
                name: true,
                username: true,
                avatarUrl: true,
                onlineStatus: true,
                confirmed: true,
                istwoFactor: true,
                id: true,
            },
        });
    }

    async findUserById(userId: number, lookupId: number): Promise<any> {
        const selfUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!selfUser) {
            throw new HttpException('User not found', 404);
        }

        const lookupUser = await this.prisma.user.findUnique({
            where: { id: lookupId },
        });
        if (!lookupUser) {
            throw new HttpException('User not found', 404);
        }

        if (selfUser.id === lookupUser.id) {
            return this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    email: true,
                    name: true,
                    username: true,
                    avatarUrl: true,
                    onlineStatus: true,
                    confirmed: true,
                    istwoFactor: true,
                    id: true,
                    Friends: true,
                },
            });
        }

        return this.prisma.user.findUnique({
            where: { id: lookupId },
            select: {
                email: true,
                name: true,
                username: true,
                avatarUrl: true,
                onlineStatus: true,
                id: true,
                Friends: {
                    where: {
                        friendId: userId,
                        userId: lookupId,
                    },
                    select: {
                        friendId: true,
                        friendshipStatus: true,
                    },
                },
            },
        });
    }

    async findUserByEmail(email: string): Promise<any> {
        return this.prisma.user.findUnique({
            where: { email: email },
            select: {
                email: true,
                name: true,
                username: true,
                avatarUrl: true,
                onlineStatus: true,
                confirmed: true,
                istwoFactor: true,
                id: true,
            },
        });
    }

    async findOrCreateUser(profile: any): Promise<any> {
        let user = await this.findUserByEmail(profile.emails[0].value);

        if (!user) {
            user = await this.createUser({
                email: profile.emails[0].value,
                name: profile.displayName,
                username: profile.username,
                oauthId: '',
                avatarUrl:
                    profile._json.image.link ||
                    profile._json.image.versions.medium ||
                    profile._json.image.versions.large ||
                    profile._json.image.versions.small,
            });
        }
        return user;
    }

    // async login(user: any) {
    //   const payload = { name: user.name, username: user.username, sub: user.id };
    //   const userData = await this.findUserByUsername(user.username);
    //   return { access_token: this.JwtService.sign(payload), data: userData};
    // }

    async login(user: any, res: Response) {
        try {
            const is2f = user.istwoFactor;
            const payload = { username: user.username, uid: user.id, is2f: is2f };
            const token = this.JwtService.sign(payload);
            res.cookie('jwt', token, { httpOnly: false, path: '/' });
            res.redirect(!is2f ? process.env.FRONTEND_REDIRECT_LOGIN_URL : process.env.FRONTEND_REDIRECT_LOGIN_2FA_URL);
        } catch (error) {
            throw new BadRequestException('ERROR:', error.message);
        }
    }

    async logout(res: Response) {
        res.clearCookie('jwt');
        res.redirect(process.env.FRONTEND_REDIRECT_LOGOUT_URL);
    }

    async updateProfileAndToken(user: any, res: Response): Promise<void> {
        const payload = { username: user.username, uid: user.id };
        this.logger.log(`Updated JWT for ${user.username}`);
        const token = this.JwtService.sign(payload);
        res.cookie('jwt', token, { httpOnly: false, path: '/' });
        res.status(200).send({ message: 'Username updated' });
    }
}
