import { Randomizer, Shuffler, standardRandomizer, standardShuffler } from '../../src/utils/random_utils'
import * as deck from '../../src/model/Deck'
import * as deckFactory from '../../src/model/DeckFactory'

// Fix (or import) these types:
type Card = any
type Deck = deck.Deck
type Round = any
type Game = any

//Fill out the empty functions
export function createInitialDeck(): Deck {
  return new deck.DrawDeck()
}

export function createDeckFromMemento(cards: Record<string, string | number>[]): Deck {
  return deckFactory.createDeckFromMemento(cards)
}

//----- this is supposed to be roundconfig not handConfig -----
export type RoundConfig = {
  players: string[]
  dealer: number
  shuffler?: Shuffler<Card>
  cardsPerPlayer?: number
}

export function createRound({
    players, 
    dealer, 
    shuffler = standardShuffler,
    cardsPerPlayer = 7
  }: RoundConfig): Round {
}

export function createRoundFromMemento(memento: any, shuffler: Shuffler<Card> = standardShuffler): Round {
}

export type GameConfig = {
  players: string[]
  targetScore: number
  randomizer: Randomizer
  shuffler: Shuffler<Card>
  cardsPerPlayer: number
}

export function createGame(props: Partial<GameConfig>): Game {
}

export function createGameFromMemento(memento: any, randomizer: Randomizer = standardRandomizer, shuffler: Shuffler<Card> = standardShuffler): Game {
}
