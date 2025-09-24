// Game.ts
import { Player, PlayerNames } from "./Player";
import { Round } from "./Round";

export class Game {
  private players: Player[];
  private currentRound: Round;
  private targetScore: number;
  private scores: Record<PlayerNames, number>;
  private cardsPerPlayer: number;

  constructor(players: Player[], targetScore: number, cardsPerPlayer: number) {
    this.players = players;
    this.targetScore =targetScore;
    this.cardsPerPlayer = cardsPerPlayer;
    this.currentRound = new Round(this.players, dealer, this.cardsPerPlayer); 
    this.scores = {} as Record<PlayerNames, number>;
      for (const p of players) {
           this.scores[p.getId()] = 0;
          } 
    }

  public getPlayer(playerId: PlayerNames): Player {
    const player = this.players.find(p => p.getId() === playerId);
    if (!player) {
      throw new Error("Invalid playerId");
    }
    return player;
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
  
  public getScores(): Record<PlayerNames, number>{
    return {...this.scores};
  }

  public createRound(dealer: number): Round {
    this.currentRound = new Round(this.players, dealer, this.cardsPerPlayer);
    return this.currentRound;
}
  public getCurrentRound(): Round  {
    return  this.currentRound ;
  }


  public getScore(playerId: PlayerNames): number {
    if (!(playerId in this.scores)) {
      throw new Error("Invalid playerId");
    }
    return this.scores[playerId];
  }

 public winner(): Player | undefined {
  const winners = Object.entries(this.scores)
    .filter(([_, score]) => score >= this.targetScore)
    .map(([id]) => this.getPlayer(id as PlayerNames));

 
    return  winners[0];
}


  // helper: add score for a player
  public addScore(playerId: PlayerNames, points: number): void {
    if (!(playerId in this.scores)) {
      throw new Error("Invalid playerId");
    }
    this.scores[playerId] += points;
  }
}
