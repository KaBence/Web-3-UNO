import { Player, PlayerNames } from "./Player";
import { Round } from "./round";
import { DrawDeck } from "./Deck";
import { GameMemento } from "./GameMemento";
export class Game {
  private id: number;
  private players: Player[];
  private currentRound?: Round;
  private targetScore: number = 500;
  private scores: Record<PlayerNames, number>;
  private dealer: number = -1;
  private winner?: PlayerNames;
  private roundHistory: [string,number][];

  constructor(id: number, memento?: GameMemento) {
    if (memento) {
      const players: Player[] = []
      for (let playerMem of memento.getPlayers()) {
        players.push(new Player(playerMem.getId(), playerMem.getName(), playerMem))
      }
      if (memento.getCurrentRound()) {
        this.currentRound = new Round(players, memento.getDealer(), memento.getCurrentRound())
      }
      this.scores = memento.getScores();
      this.dealer = memento.getDealer();
      this.players = players
      this.id = memento.getId()
      this.winner = memento.getWinner()
      this.roundHistory = memento.getRoundHistory()
      return
    }

    this.roundHistory = [];
    this.players = [];
    this.scores = {} as Record<PlayerNames, number>;
    this.id = id;
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


  public removePlayer(playerId: number): void {
    const initialPlayerCount = this.players.length;

   
    this.players = this.players.filter(p => p.getID() !== playerId);


    if (this.players.length === initialPlayerCount) {
      console.warn(`Attempted to remove player ${playerId}, but they were not found.`);
      return;
    }

   
    // If there is an active round, you MUST also remove the player from the round's list.
    if (this.currentRound) {
      this.currentRound.removePlayer(playerId);
    }
  }

  public getPlayers(): Player[] {
    // return shallow copy to protect encapsulation
    return [...this.players];
  }

  public getTargetScore(): number {
    return this.targetScore;
  }

  public getScores(): Record<PlayerNames, number> {
    return { ...this.scores };
  }

  public getId() {
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

    // Recreate players with fresh hands
    const freshPlayers = this.players.map(
      (p) => new Player(p.getID(), p.getName())
    );

    // Start new round with clean state
    this.currentRound = new Round(freshPlayers, this.dealer);

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
    if (this.currentRound?.getWinner()) {
      this.calculateRoundScores()
      this.setWinner();
    }
}

  public calculateRoundScores(): void {
    if (this.currentRound == undefined) {
      return;
    }
    let roundScore = 0;
    for (const player of this.currentRound.getPlayers()) {
      if (player != this.currentRound.roundWinner()) {
        const hand = player.getHand().getCards();
        for (const card of hand) {
          roundScore += card.getPointValue();
        }
      }
    }
    if (this.currentRound.roundWinner() != undefined) {
      this.addScore(this.currentRound.roundWinner()!.getID(), roundScore);
      this.roundHistory.push([this.currentRound.roundWinner()!.getName(), roundScore]);
    }
  }
  // helper: add score for a player
  public addScore(playerId: PlayerNames, points: number): void {
    if (!(playerId in this.scores)) {
      throw new Error("Invalid playerId");
    }
    this.scores[playerId] += points;
  }

  public createMementoFromGame(): GameMemento {
    const sourcePlayers = this.currentRound ? this.currentRound.getPlayers() : this.players;
    const playerMementos = sourcePlayers.map(player => player.createMementoFromPlayer());

    return new GameMemento(
      this.id,
      this.scores,
      this.dealer,
      playerMementos,
      this.roundHistory,
      this.currentRound ? this.currentRound.createMementoFromRound() : undefined,
      this.winner,
    );
  }
}
