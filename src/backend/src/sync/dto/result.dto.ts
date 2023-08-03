export class ResultDto {
  winner: string;
  loser: string;
  score: {
    winner: number;
    loser: number;
  };
  mode: string;
  winnerClient: any;
  loserClient: any;
};