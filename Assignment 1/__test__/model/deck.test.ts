import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { createInitialDeck, createDeckFromMemento as createDeckFromMemento } from '../utils/test_adapter'
import { standardShuffler } from '../../src/utils/random_utils'
import { is } from '../utils/predicates'
import * as deck from '../../src/model/Deck'
import * as card from '../../src/model/Card'
import { memoizingShuffler } from '../utils/shuffling'

describe("Initial deck", () => {
  const initialDeck = createInitialDeck()
  it("contains 19 numbered blue cards", () => {
    expect(
      initialDeck
      .filter(is({type: card.Type.Numbered, color: card.Colors.Blue}))
      .size())
    .toEqual(19)
  })
  it("contains 19 numbered green cards", () => {
    expect(
      initialDeck
      .filter(is({type: card.Type.Numbered, color: card.Colors.Green}))
      .size())
    .toEqual(19)
  })
  it("contains 19 numbered red cards", () => {
    expect(
      initialDeck
      .filter(is({type: card.Type.Numbered, color: card.Colors.Red}))
      .size())
    .toEqual(19)
  })
  it("contains 19 numbered yellow cards", () => {
    expect(
      initialDeck
      .filter(is({type: card.Type.Numbered, color: card.Colors.Yellow}))
      .size())
    .toEqual(19)
  })
  it("only contains numbered card with numbers between 0 and 9", () => {
    const numberedDeck = initialDeck.filter(is({type: card.Type.Numbered}))
    while(numberedDeck.size() > 0) {
      const dealtCard = numberedDeck.deal();
      if (dealtCard && dealtCard.Type === card.Type.Numbered) {
        const n = dealtCard.CardNumber;
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThan(10);
      }
    }
  })
  it("contains numbered cards of every legal number and color", () => {
    for(let color of Object.values(card.Colors)) {
      expect(initialDeck.filter(is({number: 0, color})).size()).toBe(1)
    }
    for(let number = 1; number < 10; number++) {
      for(let color of Object.values(card.Colors)) {
        expect(initialDeck.filter(is({number: number as card.CardNumber, color})).size()).toBe(2)
      }
    }
  })
  it("contains 8 skip cards", () => {
    expect(initialDeck.filter(is({type: card.Type.Skip})).size()).toEqual(8)
  })
  it("contains 2 skip cards of each color", () => {
    for(let color of Object.values(card.Colors)) {
      expect(initialDeck.filter(is({type: card.Type.Skip, color})).size()).toBe(2)
    }
  })
  it("contains 8 reverse cards", () => {
    expect(initialDeck.filter(is({type: card.Type.Reverse})).size()).toEqual(8)
  })
  it("contains 2 reverse cards of each color", () => {
    for(let color of Object.values(card.Colors)) {
      expect(initialDeck.filter(is({type: card.Type.Reverse, color})).size()).toBe(2)
    }
  })
  it("contains 8 draw cards", () => {
    expect(initialDeck.filter(is({type: card.Type.DrawTwo})).size()).toEqual(8)
  })
  it("contains 2 draw cards of each color", () => {
    for(let color of Object.values(card.Colors)) {
      expect(initialDeck.filter(is({type:card.Type.DrawTwo,color})).size()).toBe(2)
    }
  })
  it("contains 4 wild cards", () => {
    expect(initialDeck.filter(is({type:card.Type.Wild})).size()).toEqual(4)
  })
  it("contains 4 wild draw cards", () => {
    expect(initialDeck.filter(is({ type:card.Type.WildDrawFour })).size()).toEqual(4)
  })
  // Blank cards skipped, since they have no gameplay
  it("contains 108 cards", () => {
    expect(initialDeck.size()).toEqual(108)
  })
})

describe("Deck methods", () => {
  describe("shuffle", () => {
    const deck = createInitialDeck()
    it("calls the shuffler", () => {
      const mockShuffler = jest.fn()
      deck.shuffle(mockShuffler)
      expect(mockShuffler).toHaveBeenCalled()
    })
  })
  describe("deal", () => {
    let deck: deck.Deck = createInitialDeck()
    let shuffledCards: Readonly<deck.Card[]> = []
    const memoShuffler = memoizingShuffler(standardShuffler)
    beforeEach(() => {
      deck = createInitialDeck()
      deck.shuffle(memoShuffler.shuffler)
      shuffledCards = memoShuffler.memo
    })
    it("removes a card", () => {
      const deckSize = deck.size
      deck.deal()
      expect(deck.size).toEqual(deckSize - 1)
    })
    it("returns all cards in order", () => {
      const deckSize = deck.size
      for(let i = 0; i < deckSize; i++) {
        expect(deck.deal()).toEqual(shuffledCards[i])
      }
    })
    it("returns undefined if the deck is empty", () => {
      while(deck.size > 0) { 
        deck.deal() 
      }
      expect(deck.deal()).toBeUndefined()
    })
  })
})

describe('fromMemento', () => {
  describe('from valid Memnot', () => {
    it('returns a deck with all cards in order', () => {
      const cards: Record<string, string | number>[] = [
        { type: 'NUMBERED', color: 'BLUE', number: 7 },
        { type: 'SKIP', color: 'RED' },
        { type: 'REVERSE', color: 'GREEN' },
        { type: 'DRAW', color: 'YELLOW' },
        { type: 'WILD' },
        { type: 'WILD DRAW' }
      ]
      const created: deck.Deck = createDeckFromMemento(cards)
      let drawncard = created.deal()!
      expect(drawncard.Type).toEqual(card.Type.Numbered)
      expect(card.hasColor(drawncard, card.Colors.Blue)).toBeTruthy()
      expect(card.hasNumber(drawncard, 7)).toBeTruthy()
      
      drawncard = created.deal()!
      expect(drawncard.Type).toEqual(card.Type.Skip)
      expect(card.hasColor(drawncard, card.Colors.Red)).toBeTruthy()

      drawncard = created.deal()!
      expect(drawncard.Type).toEqual(card.Type.Reverse)
      expect(card.hasColor(drawncard, card.Colors.Green)).toBeTruthy()

      drawncard = created.deal()!
      expect(drawncard.Type).toEqual(card.Type.DrawTwo)
      expect(card.hasColor(drawncard, card.Colors.Yellow)).toBeTruthy()

      drawncard = created.deal()!
      expect(drawncard.Type).toEqual(card.Type.Wild)

      drawncard = created.deal()!
      expect(drawncard.Type).toEqual(card.Type.WildDrawFour)

      expect(created.deal()).toBeUndefined()
    })

    it("returns an empty deck on empty input", () => {
      const created: deck.Deck = createDeckFromMemento([])
      expect(created.size()).toEqual(0)
    })
  })

  describe("from invalid Memento", () => {
    it("throws on invalid type", () => {
      expect(() => createDeckFromMemento([{type: 'wut?'}])).toThrowError()
    })
    it("throws on missing number on numbered type", () => {
      expect(() => createDeckFromMemento([{type: card.Type.Numbered, color: 'BLUE'}])).toThrowError()
    })
    it("throws on missing color on numbered type", () => {
      expect(() => createDeckFromMemento([{type: card.Type.Numbered, number: 7}])).toThrowError()
    })
    it("throws on missing color on skip type", () => {
      expect(() => createDeckFromMemento([{type: 'SKIP'}])).toThrowError()
    })
    it("throws on missing color on reverse type", () => {
      expect(() => createDeckFromMemento([{type: 'REVERSE'}])).toThrowError()
    })
    it("throws on missing color on draw type", () => {
      expect(() => createDeckFromMemento([{type: 'DRAW'}])).toThrowError()
    })
  })
})

describe("toMemento", () => {
  it("Returns the Memento used to create it", () => {
      const cards: Record<string, string | number>[] = [
        { type: 'NUMBERED', color: 'BLUE', number: 7 },
        { type: 'SKIP', color: 'RED' },
        { type: 'REVERSE', color: 'GREEN' },
        { type: 'DRAW', color: 'YELLOW' },
        { type: 'WILD' },
        { type: 'WILD DRAW' }
      ]
      const created = createDeckFromMemento(cards)
      expect(created.toMemento()).toEqual(cards)
  })
})
