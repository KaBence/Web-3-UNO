import { Card } from "./Card";

export class Hand{
    constructor(cards?: Card[]) {
        this.cards = cards ? cards : [];
    }

    addCard(card: Card): void {
        this.cards.push(card);
    }

    removeCard(card: Card): Card | undefined {
        const index = this.cards.indexOf(card);
        return index !== -1 ? this.cards.splice(index,1)[0] : undefined;
    }

    getCards(): Card[] {
        return this.cards;
    }
    size(): number {
        return this.cards.length;
    }
    private cards: Card[] = [];
}