import { Game } from '../gateway/game';
import * as rs from 'randomstring';

export function makeId(games: Map<string, Game>, length = 10): string {
  let result = rs.generate(length);
  if (games.has(result)) {
    return makeId(games);
  }
  return result;
}
