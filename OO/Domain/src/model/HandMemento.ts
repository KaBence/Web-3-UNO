import { Card } from "./Card";

export class HandMemento {
  constructor(cards?: Card[]) {
    this.cards = cards ? cards : [];
  }

  getCards(): Card[] {
    return [...this.cards];
  }
  private readonly cards: Card[];
}
