import { CardPredicate } from "../../__test__/utils/predicates";
import * as card from "./Card";

export type Deck = {
  cards: Readonly<card.Card[]>;
};

export function CreateDeck(): Deck {
  return {
    cards: [
      ...CreateNumberedCards(),
      ...CreateColoredSpecialCards(),
      ...CreateWildCards(),
    ],
  };
}

function CreateNumberedCards(): card.Card[] {
  const cards: card.Card[] = [];
  for (let color of Object.values(card.Colors)) {
    for (let number of card.numberValues) {
      if (number !== 0) {
        cards.push(card.CreateNumberedCard(number, color));
      }
      cards.push(card.CreateNumberedCard(number, color));
    }
  }
  return cards;
}

function CreateColoredSpecialCards(): card.Card[] {
  const cards: card.Card[] = [];
  const specialTypes = [card.Type.Skip, card.Type.Reverse, card.Type.DrawTwo];

  for (let color of Object.values(card.Colors)) {
    for (let type of specialTypes) {
      if (
        type === card.Type.Skip ||
        type === card.Type.Reverse ||
        type === card.Type.DrawTwo
      ) {
        cards.push(card.CreateSpecialColoredCard(type, color));
        cards.push(card.CreateSpecialColoredCard(type, color));
      }
    }
  }
  return cards;
}

function CreateWildCards(): card.Card[] {
  const cards: card.Card[] = [];
  const wildTypes = [card.Type.Wild, card.Type.WildDrawFour];

  for (let type of wildTypes) {
    if (type === card.Type.Wild || type === card.Type.WildDrawFour) {
      cards.push(card.CreateWildCard(type));
      cards.push(card.CreateWildCard(type));
    }
  }
  return cards;
}
