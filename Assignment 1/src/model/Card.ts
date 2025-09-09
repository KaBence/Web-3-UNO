// Card Types

export type Card = NumberedCard | SpecialColoredCard | WildCard;

type NumberedCard = {
  CardNumber: CardNumber;
  Color: Colors;
  Type: Type.Numbered;
};

type SpecialColoredCard = {
  Type: Type.Skip | Type.Reverse | Type.DrawTwo;
  Color: Colors;
};

type WildCard = {
  Type: Type.Wild | Type.WildDrawFour;
};

//Checks

export function hasColor(card: Card, color: Colors): boolean {
  return "Color" in card && card.Color === color;
}

export function hasNumber(card: Card, number: CardNumber): boolean {
  return card.Type === Type.Numbered && card.CardNumber === number;
}

//Enums

export enum Colors {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
  Yellow = "YELLOW",
}

export enum Type {
  Skip = "SKIP",
  Reverse = "REVERSE",
  DrawTwo = "DRAW",
  Wild = "WILD",
  WildDrawFour = "WILD DRAW",
  Numbered = "NUMBERED",
}

export const numberValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type CardNumber = (typeof numberValues)[number];
