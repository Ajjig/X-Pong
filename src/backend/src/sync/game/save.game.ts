import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResultDto } from "../dto/result.dto";

@Injectable()
export class SaveGameService {
  private readonly prisma = new PrismaService();
  constructor() { }
  
  getUserByUsername(username: string): Promise< {id: number} > {
    return this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });
  }

  async saveGame(result: ResultDto) {
    const winnerUser = await this.getUserByUsername(result.winner);
    const loserUser = await this.getUserByUsername(result.loser);
      
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

  };
}