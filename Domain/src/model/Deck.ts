import { CardPredicate } from "../../__test__/utils/predicates";
import { Card } from "./Card";
import * as CardFactory from "./CardFactory";
import * as randomUtils from "../utils/random_utils";
import { DeckMemento } from "./DeckMemento";


export abstract class Deck {
  constructor(type: DeckTypes) {
    this.type = type;
  }

  getCards(): Card[] {
    return [...this.cards];
  }

  size(): number {
    return this.cards.length;
  }

  getType(): DeckTypes {
    return this.type;
  }

  abstract filter(predicate: CardPredicate): Deck;
  deal(): Card | undefined {
    return this.cards.pop();
  }

  addCard(card: Card): void {
    this.cards.push(card);
  }

  createMementoFromDeck(): DeckMemento {
    return new DeckMemento(this.type, this.cards);
  }

  shuffle(shuffler: (cards: Card[]) => void): void {
    shuffler(this.cards);
  }

  protected cards: Card[] = [];
  private type: DeckTypes;
}

export class DiscardDeck extends Deck {
  
  filter(predicate: CardPredicate): Deck {
    throw new Error("Method not implemented.");
  }

  peek(): Card {
    return this.cards[this.cards.length - 1];
  }
  constructor(cards?:Card[]) {
    super(DeckTypes.Discard);
    this.cards = cards ? cards : [];
  }
}

export class DrawDeck extends Deck {
  constructor(cards?: Card[]) {
    super(DeckTypes.Draw);
    this.cards = cards ? cards: [
      ...CardFactory.CreateNumberedCards(),
      ...CardFactory.CreateColoredSpecialCards(),
      ...CardFactory.CreateWildCards(),
    ];
    this.shuffle(randomUtils.standardShuffler);
  }
  
  filter(predicate: CardPredicate): Deck {
    const filteredCards = this.cards.filter((card) => predicate(card));
    return new DrawDeck(filteredCards);
  }

  peak(): Card | undefined {
    if (this.cards.length === 0) {
      return undefined;
    }
    return this.cards[this.cards.length - 1];
  }
}

export enum DeckTypes {
  Discard,
  Draw,
}
