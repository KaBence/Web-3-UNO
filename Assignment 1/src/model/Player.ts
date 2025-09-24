import { Hand } from "./Deck";

export class Player {
  private id: PlayerNames;
  private hand: Hand;
  private unoCalled: boolean;

  constructor(id: PlayerNames, hand: Hand) {
    this.id = id;
    this.hand = hand;
    this.unoCalled = false;
  }

  getID(): PlayerNames {
    return this.id;
  }

  setID(id: PlayerNames): void {
    this.id = id;
  }

  getHand(): Hand{
    return this.hand;
  }

  setHand(hand: Hand): void {
    this.hand = hand
  }

  getUno(): boolean {
    return this.unoCalled;
  }

  setUno(bool: boolean): void {
    this.unoCalled = bool;
  }

};


export enum PlayerNames {
    player1 = 1,
    player2 = 2,
    player3 = 3,
    player4 = 4,
    player5= 5,
    player6 = 6,
    player7 = 7,
    player8 = 8,
    player9 = 9,
    player10 = 10,
}