import { Hand } from "./Hand";

export class Player {
  private id: PlayerNames;
  private hand: Hand;
  private unoCalled: boolean;
  private name: string;

  constructor(id: PlayerNames, name:string) {
    this.id = id;
    this.hand = new Hand();
    this.unoCalled = false;
    this.name = name;
  }

  getName():string{
    return this.name;
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

  hasUno(): boolean {
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