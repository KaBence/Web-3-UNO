import { Hand } from "./Hand";
import { PlayerMemento } from "./PlayerMemento";

export class Player {
  private playerName: PlayerNames;
  private hand: Hand;
  private unoCalled: boolean;
  private name: string;

  constructor(id: PlayerNames, name: string, memento?: PlayerMemento) {
    if (memento) {
      this.playerName = memento.getId()
      this.name = memento.getName()
      this.hand = new Hand(memento.getHand().getCards())
      this.unoCalled = memento.getUnoCalled()
      return
    }

    this.playerName = id;
    this.hand = new Hand();
    this.unoCalled = false;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  getID(): PlayerNames {
    return this.playerName;
  }

  setID(id: PlayerNames): void {
    this.playerName = id;
  }

  getHand(): Hand {
    return this.hand;
  }

  setHand(hand: Hand): void {
    this.hand = hand
  }

  hasUno(): boolean {
    return this.unoCalled;
  }

  setUno(bool: boolean): void {
    this.unoCalled = bool;
  }

  createMementoFromPlayer(): PlayerMemento {
    return new PlayerMemento(this.playerName, this.name, this.hand.createMementoFromHand(), this.unoCalled)
  }
};


export enum PlayerNames {
  player1 = 1,
  player2 = 2,
  player3 = 3,
  player4 = 4,
  player5 = 5,
  player6 = 6,
  player7 = 7,
  player8 = 8,
  player9 = 9,
  player10 = 10,
}