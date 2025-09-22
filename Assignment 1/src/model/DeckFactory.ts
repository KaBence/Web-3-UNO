import { CardPredicate } from "../../__test__/utils/predicates";
import * as CardFactory from "./CardFactory";
import * as card from "./Card";
import { Deck, size, filterDeck, deal, DeckTypes, shuffle } from "./Deck";

export function CreateDeck(): Deck {
  return createBaseDeck([
    ...CardFactory.CreateNumberedCards(),
    ...CardFactory.CreateColoredSpecialCards(),
    ...CardFactory.CreateWildCards(),
  ]);
}

export function createBaseDeck(cards: card.Card[]): Deck {
  return {
    cards,
    type: DeckTypes.Draw,
    size(): number {
      return size(this);
    },
    filter(predicate: CardPredicate): Deck {
      return filterDeck(this, predicate);
    },
    deal(): card.Card | undefined {
      return deal(this);
    },
    shuffle(shuffler: (cards: card.Card[]) => void): void {
      shuffle(this, shuffler);
    },
  };
}

export function createDeckFromMemento(cards: Record<string, string | number>[]): Deck {
  const createdCards: card.Card[] = [];
  for (const c of cards) {
    const type = c.type as string;
    switch (type) {
      case "NUMBERED":
        if (typeof c.number !== "number" || typeof c.color !== "string") {
          throw new Error(`Invalid numbered card data: ${JSON.stringify(c)}`);
        }
        createdCards.push(CardFactory.CreateNumberedCard(c.number as card.CardNumber, c.color as card.Colors));
        break;
      case "SKIP":
      case "REVERSE":
      case "DRAW":
        if (typeof c.color !== "string") {
          throw new Error(`Invalid special colored card data: ${JSON.stringify(c)}`);
        }
        createdCards.push(CardFactory.CreateSpecialColoredCard(
          type as card.Type.Skip | card.Type.Reverse | card.Type.DrawTwo,
          c.color as card.Colors));
        break;
      case "WILD":
      case "WILD DRAW":
        createdCards.push(CardFactory.CreateWildCard(type as card.Type.Wild | card.Type.WildDrawFour));
        break;
      default:
        throw new Error(`Unknown card type: ${type}`);
    }
  }
  return createBaseDeck(createdCards);
}

export function createMementoFromDeck(deck: Deck): Record<string, string | number>[] {
  const memento: Record<string, string | number>[] = [];
  for (const deckCard of deck.cards) {
    switch (deckCard.Type) {
      case card.Type.Numbered:
        memento.push({type: deckCard.Type, color: deckCard.Color, number: deckCard.CardNumber,});
        break;
      case card.Type.Skip:
      case card.Type.Reverse:
      case card.Type.DrawTwo:
        memento.push({ type: deckCard.Type, color: deckCard.Color });
        break;
      case card.Type.Wild:
      case card.Type.WildDrawFour:
        memento.push({ type: deckCard.Type });
        break;
    }
  }
  return memento;
}
