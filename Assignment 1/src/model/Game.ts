// Game.ts
import { Player } from "./Player";
import { Round } from "./Round";

export class Game {
  private players: Player[];
  private currentRound?: Round;
  private targetScore: number;
  private scores: number[];
  private cardsPerPlayer: number;

  constructor(players: Player[], targetScore: number, cardsPerPlayer: number) {
    this.players = players;
    this.targetScore =targetScore;
    this.cardsPerPlayer = cardsPerPlayer;
    this.scores = new Array(players.length).fill(0);
  }

  public getPlayer(playerId: number): Player {
    if (playerId < 0 || playerId >= this.players.length) {
      throw new Error("Invalid playerId");
    }
    return this.players[playerId];
  }
  public getPlayers(): Player[] {
    // return shallow copy to protect encapsulation
    return [...this.players];
  }

  public getTargetScore(): number {
    return this.targetScore;
  }

  public getCardsPerPlayer(): number {
    return this.cardsPerPlayer;
  }
  
  public getScores(): number[] {
    return [...this.scores];
  }

  public createRound(dealer: number): Round {
  this.currentRound = new Round(this.players, dealer, this.cardsPerPlayer);
  return this.currentRound;
}
  public getCurrentRound(): Round | undefined {
    return this.currentRound;
  }


  public score(playerId: number): number {
    if (playerId < 0 || playerId >= this.scores.length) {
      throw new Error("Invalid playerId");
    }
    return this.scores[playerId];
  }

  public winner(): Player | null {
const winners = this.scores
  .map((s, i) => (s >= this.targetScore ? i : -1))
  .filter(i => i !== -1);

if (winners.length > 1) throw new Error("Multiple winners");
return winners.length === 1 ? this.players[winners[0]] : null;

  }

  // helper: add score for a player
  public addScore(playerId: number, points: number): void {
    if (playerId < 0 || playerId >= this.scores.length) {
      throw new Error("Invalid playerId");
    }
    this.scores[playerId] += points;
  }
}
