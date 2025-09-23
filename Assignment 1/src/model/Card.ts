export abstract class Card{
  constructor(type: Type) {
    this.type = type;
  }

  getType(): Type {
    return this.type;
  }

  getColor(): Colors | undefined {
    return this.color;
  }

  getNumber(): CardNumber | undefined {
    return this.number;
  }

  hasColor(color: Colors): boolean {
    return this.color === color;
  }
  hasNumber(number: CardNumber): boolean {
    return this.number === number;
  }

  protected color?: Colors;
  protected number?: CardNumber;
  private type: Type;
}

export class NumberedCard extends Card {
  constructor(cardNumber: CardNumber,color: Colors) {
    super(Type.Numbered);
    this.number = cardNumber;
    this.color = color;
  }
}

export class SpecialColoredCard extends Card {
  constructor(type: Type.Skip | Type.Reverse | Type.Draw, color: Colors) {
    super(type);
    this.color = color;
  }
}

export class WildCard extends Card {
  constructor(type: Type.Wild | Type.WildDrawFour) {
    super(type);
  }
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
  Draw = "DRAW",
  Wild = "WILD",
  WildDrawFour = "WILD DRAW",
  Numbered = "NUMBERED",
}

export const numberValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type CardNumber = (typeof numberValues)[number];
