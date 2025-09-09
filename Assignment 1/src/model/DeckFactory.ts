import { CardPredicate } from "../../__test__/utils/predicates";

import * as CardFactory from "./CardFactory";
import * as card from "./Card";
import { Deck, size, filterDeck, deal } from "./Deck";

export function CreateDeck(): Deck {
  return createBaseDeck([
    ...CardFactory.CreateNumberedCards(),
    ...CardFactory.CreateColoredSpecialCards(),
    ...CardFactory.CreateWildCards(),
  ]);
}

export function createDeckFromMemento(
  cards: Record<string, string | number>[]
): Deck {
  const createdCards: card.Card[] = cards.map((c) => {
    const type = c.type as string;
    switch (type) {
      case "NUMBERED":
        return CardFactory.CreateNumberedCard(
          c.number as card.CardNumber,
          c.color as card.Colors
        );
      case "SKIP":
      case "REVERSE":
      case "DRAW":
        return CardFactory.CreateSpecialColoredCard(
          type as card.Type.Skip | card.Type.Reverse | card.Type.DrawTwo,
          c.color as card.Colors
        );
      case "WILD":
      case "WILD DRAW":
        return CardFactory.CreateWildCard(
          type as card.Type.Wild | card.Type.WildDrawFour
        );
      default:
        throw new Error(`Unknown card type: ${type}`);
    }
  });
  return createBaseDeck(createdCards);
}

export function createBaseDeck(cards: card.Card[]): Deck {
  return {
    cards,
    size(): number {
      return size(this);
    },
    filter(predicate: CardPredicate): Deck {
      return filterDeck(this, predicate);
    },
    deal(): card.Card | undefined {
      return deal(this);
    },
  };
}
