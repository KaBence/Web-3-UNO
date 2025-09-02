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

// Create card Functions

export function CreateNumberedCard(number: CardNumber, color: Colors): Card {
  return { CardNumber: number, Color: color, Type: Type.Numbered };
}

export function CreateSpecialColoredCard(type: Type.Skip | Type.Reverse | Type.DrawTwo, color: Colors): Card {
  return { Type: type, Color: color };
}

export function CreateWildCard(type: Type.Wild | Type.WildDrawFour): Card {
  return { Type: type };
}

//Enums

export enum Colors {
  Red = "1",
  Green = "2",
  Blue = "3",
  Yellow = "4",
}

export enum Type {
  Skip = "1",
  Reverse = "2",
  DrawTwo = "3",
  Wild = "4",
  WildDrawFour = "5",
  Numbered = "0",
}

export const numberValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type CardNumber = (typeof numberValues)[number];
