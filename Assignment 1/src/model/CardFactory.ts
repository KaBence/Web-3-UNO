import { CardNumber, Colors, Type, Card, numberValues } from "./Card";

export function CreateNumberedCard(number: CardNumber, color: Colors): Card {
  return { CardNumber: number, Color: color, Type: Type.Numbered };
}

export function CreateSpecialColoredCard( type: Type.Skip | Type.Reverse | Type.DrawTwo, color: Colors): Card {
  return { Type: type, Color: color };
}

export function CreateWildCard(type: Type.Wild | Type.WildDrawFour): Card {
  return { Type: type };
}


export function CreateNumberedCards(): Card[] {
  const cards: Card[] = [];
  for (let color of Object.values(Colors)) {
    for (let number of numberValues) {
      if (number !== 0) {
        cards.push(CreateNumberedCard(number, color));
      }
      cards.push(CreateNumberedCard(number, color));
    }
  }
  return cards;
}

export function CreateColoredSpecialCards(): Card[] {
  const cards: Card[] = [];
  const specialTypes = [Type.Skip, Type.Reverse, Type.DrawTwo];

  for (let color of Object.values(Colors)) {
    for (let type of specialTypes) {
      if (type === Type.Skip || type === Type.Reverse || type === Type.DrawTwo) {
        cards.push(CreateSpecialColoredCard(type, color));
        cards.push(CreateSpecialColoredCard(type, color));
      }
    }
  }
  return cards;
}

export function CreateWildCards(): Card[] {
  const cards: Card[] = [];
  const wildTypes = [Type.Wild, Type.WildDrawFour];
  for (let type of wildTypes) {
    if (type === Type.Wild || type === Type.WildDrawFour) {
      cards.push(CreateWildCard(type));
      cards.push(CreateWildCard(type));
      cards.push(CreateWildCard(type));
      cards.push(CreateWildCard(type));
    }
  }
  return cards;
}
