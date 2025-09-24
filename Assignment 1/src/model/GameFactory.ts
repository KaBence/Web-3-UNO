// GameFactory.ts
import { Game } from "./Game";
import { Player, PlayerNames } from "./Player";
import { Round } from "./Round";

export type GameMemento = {
  players: PlayerNames[];
  targetScore: number;
  cardsPerPlayer: number;
  scores: Record<PlayerNames, number>;
};

export class GameFactory {
  public static createGame(
    players: Player[],
    targetScore: number,
    cardsPerPlayer: number, 
    currentRound: Round 
  ): Game {
    return new Game(players, targetScore, cardsPerPlayer, currentRound);
  }

  //later reconsider

  /*public static createGameFromMemento(record: GameMemento): Game {
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
  }*/
}
