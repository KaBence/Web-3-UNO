// Game.ts
import { Player, PlayerNames } from "./Player";
import { Round } from "./Round";

export class Game {
  private players: Player[];
  private currentRound: Round;
  private targetScore: number;
  private scores: Record<PlayerNames, number>;
  private cardsPerPlayer: number;
  private dealer: number = 0;

  constructor(players: Player[], targetScore: number, cardsPerPlayer: number) {
    this.players = players;
    this.targetScore =targetScore;
    this.cardsPerPlayer = cardsPerPlayer;
    this.currentRound = new Round(this.players, this.dealer, this.cardsPerPlayer); 
    this.scores = {} as Record<PlayerNames, number>;
      for (const p of players) {
           this.scores[p.getID()] = 0;
          } 
    }

  public getPlayer(playerId: PlayerNames): Player {
    const player = this.players.find(p => p.getID() === playerId);
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
    this.dealer = this.dealer++ % this.players.length;
    this.currentRound = new Round(this.players, this.dealer, this.cardsPerPlayer);
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
  for (const [id,score] of Object.entries(this.scores)) {
    if(score >= this.targetScore) {
      let tempID = Number(id) as PlayerNames;
      return this.getPlayer(tempID);
    }
  }
  return undefined;
}


  // helper: add score for a player
  public addScore(playerId: PlayerNames, points: number): void {
    if (!(playerId in this.scores)) {
      throw new Error("Invalid playerId");
    }
    this.scores[playerId] += points;
  }
}
