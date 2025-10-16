export abstract class Card{
  constructor(type: Type, color?: Colors) {
    this.type = type;
    color ? (this.color = color) : undefined;
    this.pointValue = 0;
  }

  getType(): Type {
    return this.type;
  }

  getPointValue(): number {
    return this.pointValue;
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

  toString(): string {
    switch(this.type){
      case Type.Draw:
        return this.color+" Draw two"
      case Type.Skip:
        return this.color+" Skip"
      case Type.Reverse:
        return this.color+" Reverse"
      case Type.Wild:
        return this.color+ " Wild Card"
      case Type.WildDrawFour:
        return this.color+" Wild Draw four"
      case Type.Numbered:
        return this.color+ " "+this.number
      case Type.Dummy:
        return "Wild Card"
      case Type.DummyDraw4:
        return "Wild Draw 4"
    }
  }

  protected pointValue: number;
  protected color?: Colors;
  protected number?: CardNumber;
  private type: Type;
}

export class NumberedCard extends Card {
  constructor(cardNumber: CardNumber,color: Colors) {
    super(Type.Numbered);
    this.number = cardNumber;
    this.color = color;
    this.pointValue = cardNumber;
  }
}

export class SpecialColoredCard extends Card {
  constructor(type: Type.Skip | Type.Reverse | Type.Draw | Type.Dummy | Type.DummyDraw4, color: Colors,) {
    super(type);
    this.color = color;
    this.pointValue = 20;
  }
}

export class WildCard extends Card {
  constructor(type: Type.Wild | Type.WildDrawFour) {
    super(type);
    this.pointValue = 50;
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
  Dummy = "DUMMY",
  DummyDraw4 = "DUMMY4"
}

export const numberValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type CardNumber = (typeof numberValues)[number];


