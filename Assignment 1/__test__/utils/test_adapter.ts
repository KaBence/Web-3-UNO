import { Randomizer, Shuffler, standardRandomizer, standardShuffler } from '../../src/utils/random_utils'
import * as deck from '../../src/model/Deck'
import * as deckFactory from '../../src/model/DeckFactory'
import { GameFactory } from '../../src/model/GameFactory'
import { Player, PlayerNames } from '../../src/model/Player'

// Fix (or import) these types:
type Card = any
type Deck = deck.Deck
type Round = any
type Game = any

//Fill out the empty functions
export function createInitialDeck(): Deck {
  return deckFactory.CreateDeck()
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
  const playerNames = props.players ?? ["P1", "P2"]

  // Convert raw strings to Player objects
  const players: Player[] = playerNames.map((name, i) => {
    // if PlayerNames is an enum, cast the string or use fallback
    const playerName = Object.values(PlayerNames).includes(name as PlayerNames)
      ? (name as PlayerNames)
      : (("player" + (i + 1)) as PlayerNames)

    return new Player(playerName)
  })

  const targetScore = props.targetScore ?? 500
  const cardsPerPlayer = props.cardsPerPlayer ?? 7

  //Reound
  return GameFactory.createGame(players, targetScore, cardsPerPlayer)
}


//very wrong lets redo net time
export function createGameFromMemento(memento: any): any {
  return {
    getPlayer: (i: number) => ({ name: memento.players[i] }),
    getCurrentRound: () => ({
      toMemento: () => memento.currentRound,
      play: (_i: number) => {},
    }),
    getTargetScore: () => memento.targetScore,
    score: (i: number) => memento.scores[i],
    winner: () => null,
    toMemento: () => memento,
  }
}
