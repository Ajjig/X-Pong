import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ResultDto } from '../dto/result.dto';
import { Userstats } from '@prisma/client';
import { AchievementDto } from '../dto/achievement.dto';

const ACHIEVEMENTS: { [key: string]: AchievementDto } = {

    'newbie': {
        name: 'Newbie!',
        description: 'Score your first goal',
        iconUrl: '/achievements/newbie.jpg',
    },

    'first-win': {
        name: 'First Win',
        description: 'Win your first game ever',
        iconUrl: '/achievements/firstwin.jpg',
    },

    '3-goals': {
        name: 'Such a hat-trick',
        description: 'Win a 1v1 game with hat-trick difference',
        iconUrl: '/achievements/3goals.jpg',
    },

    '5-goals': {
        name: 'The king who scored 5 goals in a single game',
        description: 'Score 5 goals in a single 1v1 game',
        iconUrl: '/achievements/5goals.jpg',
    },

    'harry-maguire': {
        name: 'Three times',
        description: 'Lose with difference of 3 goals in a game',
        iconUrl: '/achievements/harrymaguire.jpg',
    },

    '5-wins': {
        name: '5 wins',
        description: 'Win 5 games',
        iconUrl: '/achievements/5wins.jpg',
    },

    '10-wins': {
        name: '10 wins',
        description: 'Win 10 games',
        iconUrl: '/achievements/10wins.jpg',
    },

    '50-wins': {
        name: '50 wins',
        description: 'Win 50 games',
        iconUrl: '/achievements/50wins.jpg',
    },

    'bronze': {
        name: 'Bronze',
        description: 'You are a bronze player now',
        iconUrl: '/levels/bronze.svg',
    },

    'silver': {
        name: 'Silver',
        description: 'You are promoted to silver',
        iconUrl: '/levels/silver.svg',
    },

    'gold': {
        name: 'Gold',
        description: 'Another promotion, you are a gold player now',
        iconUrl: '/levels/gold.svg',
    },

    'platinum': {
        name: 'Platinum',
        description: 'Platinum player!!!',
        iconUrl: '/levels/platinum.svg',
    },

    'diamond': {
        name: 'Diamond',
        description: 'You are a diamond player now',
        iconUrl: '/levels/diamond.svg',
    },

    'master': {
        name: 'Master',
        description: 'You are ping pong master now',
        iconUrl: '/levels/master.svg',
    },

    'legend': {
        name: 'Legend',
        description: 'A legend',
        iconUrl: '/levels/legend.svg',
    },

    'the-chosen-one': {
        name: 'The Chosen One',
        description: 'Your are the GOAT',
        iconUrl: '/levels/the_chosen_one.svg',
    },

};

@Injectable()
export class SaveGameService {
    private readonly prisma = new PrismaService();
    private readonly logger = new Logger('SAVE-GAME');
    constructor() {}

    async getUserByUsername(username: string): Promise<{
        id: number;
        Userstats: {
            id: number;
            achievements: AchievementDto[];
            wins: number;
            losses: number;
            ladder: string;
        }
    }> {
        return await this.prisma.user.findUnique({
            where: {
                username: username,
            },
            select: {
                id: true,
                Userstats: {
                    select: {
                        id: true,
                        achievements: true,
                        wins: true,
                        losses: true,
                        ladder: true,
                    },
                }
            },
        });
    }

    async handleAchievements(result: ResultDto) {
        if (result.score.winner === 5 && result.score.loser === 0) {
            await this.saveAchievement(result.winner, result.winnerClient, '5-goals');
            await this.saveAchievement(result.loser, result.loserClient, 'harry-maguire');
        }

        if (result.score.winner - result.score.loser >= 3) {
            await this.saveAchievement(result.winner, result.winnerClient, '3-goals');
        }

        const winnerWins = (await this.getUserByUsername(result.winner)).Userstats.wins;
        const loserWins = (await this.getUserByUsername(result.loser)).Userstats.wins;

        if (loserWins === 0 && result.score.loser === 1) {
            await this.saveAchievement(result.loser, result.loserClient, 'newbie');
        }

        if (winnerWins === 0) {
            await this.saveAchievement(result.winner, result.winnerClient, 'first-win');
            await this.saveAchievement(result.winner, result.winnerClient, 'newbie');
        }

        if (winnerWins === 5) {
            await this.saveAchievement(result.winner, result.winnerClient, '5-wins');
        }

        if (winnerWins === 10) {
            await this.saveAchievement(result.winner, result.winnerClient, '10-wins');
        }

        if (winnerWins === 50) {
            await this.saveAchievement(result.winner, result.winnerClient, '50-wins');
        }

        // update user stats ladder by wins
        try {
            const winnerId = (await this.getUserByUsername(result.winner)).id;
            if (winnerWins === 2) {
                await this.prisma.userstats.update({
                    where: { userId: winnerId },
                    data: { ladder: 'Bronze' },
                });
                result.winnerClient && result.winnerClient.emit('achievement', ACHIEVEMENTS['bronze']);
                
            }

            if (winnerWins === 3) {
                await this.prisma.userstats.update({
                    where: { userId: winnerId },
                    data: { ladder: 'Silver' },
                });
                result.winnerClient && result.winnerClient.emit('achievement', ACHIEVEMENTS['silver']);
            }

            if (winnerWins === 4) {
                await this.prisma.userstats.update({
                    where: { userId: winnerId },
                    data: { ladder: 'Gold' },
                });
                result.winnerClient && result.winnerClient.emit('achievement', ACHIEVEMENTS['gold']);
            }

            if (winnerWins === 5) {
                await this.prisma.userstats.update({
                    where: { userId: winnerId },
                    data: { ladder: 'Platinum' },
                });
                result.winnerClient && result.winnerClient.emit('achievement', ACHIEVEMENTS['platinum']);
            }

            if (winnerWins === 10) {
                await this.prisma.userstats.update({
                    where: { userId: winnerId },
                    data: { ladder: 'Diamond' },
                });
                result.winnerClient && result.winnerClient.emit('achievement', ACHIEVEMENTS['diamond']);
            }

            if (winnerWins === 20) {
                await this.prisma.userstats.update({
                    where: { userId: winnerId },
                    data: { ladder: 'Master' },
                });
                result.winnerClient && result.winnerClient.emit('achievement', ACHIEVEMENTS['master']);
            }

            if (winnerWins === 30) {
                await this.prisma.userstats.update({
                    where: { userId: winnerId },
                    data: { ladder: 'Legend' },
                });
                result.winnerClient && result.winnerClient.emit('achievement', ACHIEVEMENTS['legend']);
            }

            if (winnerWins === 50) {
                await this.prisma.userstats.update({
                    where: { userId: winnerId },
                    data: { ladder: 'The Chosen One' },
                });
                result.winnerClient && result.winnerClient.emit('achievement', ACHIEVEMENTS['the-chosen-one']);
            }
        } catch (error) {}
    }

    async createUsersStatsIfNotExists(username: string) {
        const uid = (await this.getUserByUsername(username)).id;
        await this.prisma.userstats.create({
            data: {
                user: {
                    connect: {
                        id: uid,
                    },
                },
            },
        });
    }

    async saveGame(result: ResultDto) {
        try {
            const winnerUser = await this.getUserByUsername(result.winner);
            const loserUser = await this.getUserByUsername(result.loser);

            if (winnerUser.Userstats === null) this.createUsersStatsIfNotExists(result.winner);
            if (loserUser.Userstats === null) this.createUsersStatsIfNotExists(result.loser);

            await this.handleAchievements(result);
            // create Winner match
            await this.prisma.matchs.create({
                data: {
                    result: 'WIN',
                    playerScore: result.score.winner,
                    opponentScore: result.score.loser,
                    mode: result.mode,
                    opponenId: loserUser.id,
                    user: {
                        connect: {
                            id: winnerUser.id,
                        },
                    },
                },
            });

            // create Loser match
            await this.prisma.matchs.create({
                data: {
                    result: 'LOSE',
                    playerScore: result.score.loser,
                    opponentScore: result.score.winner,
                    mode: result.mode,
                    opponenId: winnerUser.id,
                    user: {
                        connect: {
                            id: loserUser.id,
                        },
                    },
                },
            });

            await this.prisma.userstats.update({
                where: { userId: winnerUser.id },
                data: { wins: { increment: 1 } },
            });

            await this.prisma.userstats.update({
                where: { userId: loserUser.id },
                data: { losses: { increment: 1 } },
            });
        } catch (error) {
            this.logger.warn(error);
        }
    }

    async saveAchievement(username: string, client: any, achievement: string) {
        if (!ACHIEVEMENTS[achievement]) return;

        const userStats = (await this.getUserByUsername(username)).Userstats;

        // check if user already has this achievement
        const userAchievements = userStats.achievements;

        if (userAchievements.find((a) => a.name === ACHIEVEMENTS[achievement].name)) return;

        await this.prisma.achievements.create({
            data: {
                name: ACHIEVEMENTS[achievement].name,
                description: ACHIEVEMENTS[achievement].description,
                iconUrl: ACHIEVEMENTS[achievement].iconUrl,
                user: {
                    connect: {
                        id: userStats.id,
                    },
                },
            },
        });

        client && client.emit('achievement', ACHIEVEMENTS[achievement]);
    }
}
