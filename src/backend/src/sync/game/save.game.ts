import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResultDto } from "../dto/result.dto";
import { Userstats } from "@prisma/client";
import { AchievementDto } from "../dto/achievement.dto";

const ACHIEVEMENTS: { [key: string]: AchievementDto } = {
  "first-win": {
    name: "First Win",
    description: "Win your first game",
    iconUrl: "/upload/achievements/firstwin.jpg",
  },

  "3-goals": {
    name: "Such a hat-trick",
    description: "Score 3 goals in a game before your opponent scores 1",
    iconUrl: "/upload/achievements/3goals.jpg",
  },

  "5-goals": {
    name: "The king who scored 5 goals",
    description: "Score 5 goals in a game before your opponent scores 1",
    iconUrl: "/upload/achievements/5goals.jpg",
  },

  "harry-maguire": {
    name: "Harry Maguire!",
    description: "Lose with difference of 3 goals",
    iconUrl: "/upload/achievements/harrymaguire.jpg",
  },

  "5-wins": {
    name: "5 wins",
    description: "Win 5 games",
    iconUrl: "/upload/achievements/5wins.jpg",
  },

  "10-wins": {
    name: "10 wins",
    description: "Win 10 games",
    iconUrl: "/upload/achievements/10wins.jpg",
  },

  "50-wins": {
    name: "50 wins",
    description: "Win 50 games",
    iconUrl: "/upload/achievements/50wins.jpg",
  },
};
  

@Injectable()
export class SaveGameService {
  private readonly prisma = new PrismaService();
  private readonly logger = new Logger('SAVE-GAME');
  constructor() { }
  
  async getUserByUsername(username: string): Promise<{ id: number, Userstats: Userstats } > {
    return await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        Userstats: true,
      },
    });
  }

  async handleAchievements(result: ResultDto) {
    if (result.score.winner === 5 && result.score.loser === 0) {
      await this.saveAchievement(result.winner, result.winnerClient, "5-goals");
    }

    if (result.score.winner === 1 && result.score.loser === 0) {
      await this.saveAchievement(result.winner, result.winnerClient, "3-goals");
      await this.saveAchievement(result.loser, result.loserClient, "harry-maguire");
    }

    const winnerWins = (await this.getUserByUsername(result.winner)).Userstats.wins;
    if (winnerWins === 1) {
      await this.saveAchievement(result.winner, result.winnerClient, "first-win");
    }

    if (winnerWins === 5) {
      await this.saveAchievement(result.winner, result.winnerClient, "5-wins");
    }

    if (winnerWins === 10) {
      await this.saveAchievement(result.winner, result.winnerClient, "10-wins");
    }

    if (winnerWins === 50) {
      await this.saveAchievement(result.winner, result.winnerClient, "50-wins");
    }

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
          result: "WIN",
          playerScore: result.score.winner,
          opponentScore: result.score.loser,
          mode: result.mode,
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
          result: "LOSE",
          playerScore: result.score.loser,
          opponentScore: result.score.winner,
          mode: result.mode,
          user: {
            connect: {
              id: loserUser.id,
            },
          },
        },
      });
  
      await this.prisma.userstats.update({
        where: { userId: winnerUser.id },
        data: { wins: { increment: 1 } }
      });
      
      await this.prisma.userstats.update({
        where: { userId: loserUser.id },
        data: { losses: { increment: 1 } }
      });
    
    } catch (error) {
      this.logger.warn(error);
    }
    
  };

  async saveAchievement(username: string, client: any, achievement: string) {

    if (!ACHIEVEMENTS[achievement]) return;

    const userStatsId = (await this.getUserByUsername(username)).Userstats.id;


    // check if user already has this achievement
    const userAchievements = await this.prisma.achievements.findMany({
      where: { userId: userStatsId },
    });

    if (userAchievements.find((a) => a.name === ACHIEVEMENTS[achievement].name)) return;

    await this.prisma.achievements.create({
      data: {
        name: ACHIEVEMENTS[achievement].name,
        description: ACHIEVEMENTS[achievement].description,
        iconUrl: ACHIEVEMENTS[achievement].iconUrl,
        user: { connect: { id: userStatsId } },
      },
    });

    client.emit("achievement", ACHIEVEMENTS[achievement]);
  }
}