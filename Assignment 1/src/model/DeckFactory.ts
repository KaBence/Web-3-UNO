import * as CardFactory from "./CardFactory";
import * as card from "./Card";
import { Deck, DrawDeck } from "./Deck";

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
          type as card.Type.Skip | card.Type.Reverse | card.Type.Draw,
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
  return new DrawDeck(createdCards);
}

