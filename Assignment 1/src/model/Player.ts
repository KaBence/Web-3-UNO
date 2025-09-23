import { Card } from "./Card"



//just to not have it empty ...let be owerwritten later
export enum PlayerNames {
  player1 = "PLAYER1",
  player2 = "PLAYER2",
  player3 = "PLAYER3",
  player4 = "PLAYER4",
  // extend if more players are allowed
}

export class Player {
  public readonly name: PlayerNames
  private hand: Card[]
  private score: number

  constructor(name: PlayerNames, hand: Card[] = [], score: number = 0) {
    this.name = name
    this.hand = hand
    this.score = score
  }

  // ----- Hand management -----
  public getHand(): Card[] {
    return [...this.hand] // return copy to avoid mutation from outside
  }

  public addCard(card: Card): void {
    this.hand.push(card)
  }

  public removeCard(card: Card): boolean {
    const index = this.hand.findIndex(c =>
      "Color" in c && "CardNumber" in c
        ? (c as any).Color === (card as any).Color &&
          (c as any).CardNumber === (card as any).CardNumber &&
          c.Type === card.Type
        : c.Type === card.Type
    )
    if (index !== -1) {
      this.hand.splice(index, 1)
      return true
    }
    return false
  }

  public hasNoCards(): boolean {
    return this.hand.length === 0
  }

  // ----- Score management -----
  public getScore(): number {
    return this.score
  }

  public addScore(points: number): void {
    this.score += points
  }

  public resetScore(): void {
    this.score = 0
  }

  // ----- Identity -----
  public getName(): PlayerNames {
    return this.name
  }
}
