// Game.ts
import { Player, PlayerNames } from "./Player";
import { Round } from "./round";
import { DrawDeck } from "./Deck";
import { GameMemento } from "./GameMemento";
import { PlayerMemento } from "./PlayerMemento";
import { Hand } from "./Hand";

export class Game {
  private id: number;
  private players: Player[];
  private currentRound?: Round;
  private targetScore: number = 500;
  private scores: Record<PlayerNames, number>;
  private cardsPerPlayer: number = 7;
  private dealer: number = -1;
  // private isActive:boolean
  private winner?: PlayerNames;

  constructor(id: number) {
    this.players = [];
    this.scores = {} as Record<PlayerNames, number>;
    this.id = id;
    // this.currentRound = new Round([],-1)
    // this.isActive = false
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

  public getId(){
    return this.id
  }

  private selectDealer(): number {
    let highestCardValue = -1;
    let dealer: PlayerNames = this.players[0].getID();
    const dealerDeck = new DrawDeck();

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
    } else {
      this.dealer = (this.dealer + 1) % this.players.length;
    }
    this.currentRound = new Round(
      this.players,
      this.dealer
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

  public setWinner(): void {
    for (const [id, score] of Object.entries(this.scores)) {
      if (score >= this.targetScore) {
        let tempID = Number(id) as PlayerNames;
        this.winner = tempID;
      }
    }
  }

  public roundFinished(): void {
    if (this.currentRound?.getWinner())
    {
      this.calculateRoundScores()
      this.setWinner();
      if(!this.winner)
      {
        this.createRound()
      }

    }
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

  public createGameFromMemento(memento: GameMemento): void {
    const players:Player[] = []
    for(let player of memento.getPlayers()){
      let p = new Player(player.getId(),player.getName());
      p.getHand().createHandFromMemento(player.getHand())
      p.setUno(player.getUnoCalled())
      players.push(p)
    }
    this.scores = memento.getScores();
    if(memento.getCurrentRound()){
      let round = new Round(players,memento.getDealer())
      round.createRoundFromMememto(memento.getCurrentRound()!)
      this.currentRound = round
    }
    this.dealer = memento.getDealer();
    this.players = players
  }

  public createMementoFromGame(): GameMemento {
    let playerMementos: PlayerMemento[] = [];
    for (let player of this.players){
      playerMementos.push(player.createMementoFromPlayer())
    }

    return new GameMemento(
      this.id,
      this.scores,
      this.dealer,
      playerMementos,
      this.currentRound ? this.currentRound.createMementoFromRound() : undefined
    );
  }
}
