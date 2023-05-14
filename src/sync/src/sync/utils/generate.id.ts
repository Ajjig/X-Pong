import { GameService } from "../gateway/game.service";


export function makeId(games : Map<string, GameService>) : string {
    let result = '';
    let length = 10;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    let counter = 0;
    while (counter < length) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
      counter++;
    }
    if (games.has(result)) {
      return makeId(games);
    }
    return result;
}
