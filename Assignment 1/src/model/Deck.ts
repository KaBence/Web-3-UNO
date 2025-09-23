import { CardPredicate } from "../../__test__/utils/predicates";
import { Card ,Type} from "./Card";
import * as deckFactory from "./DeckFactory";
import * as CardFactory from "./CardFactory";

export abstract class Deck {
  constructor(type: DeckTypes) {
    this.type = type;
  }

  size(): number {
    return this.cards.length;
  }

  getType(): DeckTypes {  
    return this.type;
  }

  abstract filter(predicate: CardPredicate): Deck;
  abstract deal(): Card | undefined;

  createMementoFromDeck(): Record<string, string | number>[] {
    const memento: Record<string, string | number>[] = [];
    for (const deckCard of this.cards) {
      switch (deckCard.getType()) {
        case Type.Numbered:
          memento.push({type: deckCard.getType(), color: deckCard.getColor()!, number: deckCard.getNumber()!,});
          break;
        case Type.Skip:
        case Type.Reverse:
        case Type.Draw:
          memento.push({ type: deckCard.getType(), color: deckCard.getColor()! });
          break;
        case Type.Wild:
        case Type.WildDrawFour:
          memento.push({ type: deckCard.getType() });
          break;
      }
    }
    return memento;
  }

  shuffle(shuffler: (cards: Card[]) => void): void {
    shuffler(this.cards);
  }

  protected cards: Card[] = [];
  private type: DeckTypes;
}

export class DiscardDeck extends Deck {
  deal(): Card | undefined {
    throw new Error("Method not implemented.");
  }
  filter(predicate: CardPredicate): Deck {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super(DeckTypes.Discard);
  }
}

export class DrawDeck extends Deck {
  filter(predicate: CardPredicate): Deck {
    const filteredCards = this.cards.filter((card) => predicate(card));
    return new DrawDeck(filteredCards);
  }
  constructor(cards?: Card[]) {
    super(DeckTypes.Draw);
    this.cards = cards ? cards: [
          ...CardFactory.CreateNumberedCards(),
          ...CardFactory.CreateColoredSpecialCards(),
          ...CardFactory.CreateWildCards(),
        ];
  }

  deal(): Card | undefined {
    if (this.size() === 0) {
      return undefined;
    }
    const [topCard, ...remainingCards] = this.cards;
    this.cards = remainingCards;
    return topCard;
  }
}

export class HandDeck extends Deck {
  deal(): Card | undefined {
    throw new Error("Method not implemented.");
  }
  filter(predicate: CardPredicate): Deck {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super(DeckTypes.Hand);
  }
}

export enum DeckTypes {
  Discard,
  Draw,
  Hand,
}
