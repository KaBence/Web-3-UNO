import { Hand } from "./Deck";

export class Player {
  id: PlayerNames;
  hand: Hand;
  score: number;
  uno: boolean;

  constructor(id: PlayerNames, hand: Hand) {
    this.id = id;
    this.hand = hand;
    this.score = 0;
    this.uno = false;
  }

  setUno(bool: boolean): void {
    this.uno = bool;
  }

  setScore(score: number): void {
    this.score += score;
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