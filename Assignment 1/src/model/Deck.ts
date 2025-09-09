import { CardPredicate } from "../../__test__/utils/predicates";
import { Card } from "./Card";
import * as deckFactory from "./DeckFactory";

export type Deck = {
  cards: Readonly<Card[]>;
  size(): number;
  filter(predicate: CardPredicate): Deck;
  deal(): Card | undefined;
};

export function size(deck: Deck): number {
  return deck.cards.length;
}

export function filterDeck(deck: Deck, predicate: CardPredicate): Deck {
  const filteredCards = deck.cards.filter((card) => predicate(card));
  return deckFactory.createBaseDeck(filteredCards);
}

export function deal(deck: Deck): Card | undefined {
  if (deck.size() === 0) {
    return undefined;
  }
  const [topCard, ...remainingCards] = deck.cards;
  deck.cards = remainingCards;
  return topCard;
}
