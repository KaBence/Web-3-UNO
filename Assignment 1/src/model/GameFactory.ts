// GameFactory.ts
import { Game } from "./Game";
import { Player, PlayerNames } from "./Player";

export type GameMemento = {
  players: PlayerNames[];
  targetScore: number;
  cardsPerPlayer: number;
  scores: number[];
};

export class GameFactory {
  public static createGame(
    players: Player[],
    targetScore: number,
    cardsPerPlayer: number
  ): Game {
    return new Game(players, targetScore, cardsPerPlayer);
  }

  public static createGameFromMemento(record: GameMemento): Game {
    const players = record.players.map((p: PlayerNames) => new Player(p));
    const game = new Game(players, record.targetScore, record.cardsPerPlayer);

    // restore scores
    record.scores.forEach((score, i) => game["addScore"](i, score));

    return game;
  }

  public static createMementoFromGame(game: Game): GameMemento {
    return {
      players: game.getPlayers().map(p =>  p.getName() ), 
      targetScore: game.getTargetScore(),
      cardsPerPlayer: game.getCardsPerPlayer(),
      scores: game.getScores(),
    };
  }
}
