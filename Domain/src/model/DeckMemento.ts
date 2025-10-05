import { Card } from "./Card";
import { DeckTypes } from "./Deck";

export class DeckMemento {
  constructor(type: DeckTypes, cards?: Card[]) {
    this.cards = cards ? cards : [];
    this.type = type
  }

  private readonly cards: Card[] = [];
  private readonly type: DeckTypes

  public getCards() {
    return [...this.cards];
  }

  public getType(){
    return this.type
  }
}
