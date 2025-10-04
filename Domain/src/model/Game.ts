// Game.ts
import { Player, PlayerNames } from "./Player";
import { Round } from "./Round";
import { DrawDeck } from "./Deck";

export class Game {
  private players: Player[];
  private currentRound?: Round;
  private targetScore: number;
  private scores: Record<PlayerNames, number>;
  private cardsPerPlayer: number;
  private dealer: number = -1;

  constructor(targetScore: number, cardsPerPlayer: number) {
    this.players = {} as Player[];
    this.targetScore = targetScore;
    this.cardsPerPlayer = cardsPerPlayer;
    this.scores = {} as Record<PlayerNames, number>;
  }

  public getPlayer(playerId: PlayerNames): Player {
    const player = this.players.find((p) => p.getID() === playerId);
    if (!player) {
      throw new Error("Invalid playerId");
    }
    return player;
  }

  public addPlayer(name: string): void {
    let id = this.players.length + 1;
    this.players.push(new Player(id, name));
    this.scores[id as PlayerNames] = 0;
  }

  public removePlayer(id: PlayerNames): void {
    let player = this.getPlayer(id);
    let index = this.players.indexOf(player);
    this.players.splice(index, 1)[0];
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

  public getScores(): Record<PlayerNames, number> {
    return { ...this.scores };
  }

    private selectDealer(): number {
    let highestCardValue = -1;
    let dealer: PlayerNames = this.players[0].getID();
    const dealerDeck = new DrawDeck;

    this.players.forEach((player) => {
      const card = dealerDeck.deal();
      if (card) {
        const cardValue = card.getPointValue();
        if (cardValue > highestCardValue) {
          highestCardValue = cardValue;
          dealer = player.getID();
        }
      }
    });
    return dealer.valueOf();
  }

  private setInitialDealer(): void {
    this.dealer = this.selectDealer();
  }



  public createRound(): Round {
      if (this.dealer === -1) {
        this.setInitialDealer();
      }
      else {
        this.dealer = (this.dealer + 1) % this.players.length;
      }
      this.currentRound = new Round(
      this.players,
      this.dealer,
      this.cardsPerPlayer
    );
    return this.currentRound;
  }
  public getCurrentRound(): Round | undefined {
    return this.currentRound;
  }

  public getScore(playerId: PlayerNames): number {
    if (!(playerId in this.scores)) {
      throw new Error("Invalid playerId");
    }
    return this.scores[playerId];
  }

  public winner(): Player | undefined {
    for (const [id, score] of Object.entries(this.scores)) {
      if (score >= this.targetScore) {
        let tempID = Number(id) as PlayerNames;
        return this.getPlayer(tempID);
      }
    }
    return undefined;
  }

  public calculateRoundScores(): void {
    if (this.currentRound == undefined) {
      return;
    }
    let roundScore = 0;
    for (const player of this.players) {
      if (player != this.currentRound.winner()) {
        const hand = player.getHand().getCards();
        for (const card of hand) {
          roundScore += card.getPointValue();
        }
      }
    }
    if (this.currentRound.winner() != undefined) {
      this.addScore(this.currentRound.winner()!.getID(), roundScore);
    }
  }
  // helper: add score for a player
  public addScore(playerId: PlayerNames, points: number): void {
    if (!(playerId in this.scores)) {
      throw new Error("Invalid playerId");
    }
    this.scores[playerId] += points;
  }
}
