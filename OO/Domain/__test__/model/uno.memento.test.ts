import { describe, it, expect, beforeEach } from "@jest/globals"
import { createGameFromMemento } from "../utils/test_adapter"
import { PlayerNames } from "../../src/model/Player"
import { Type, Colors } from "../../src/model/Card"

// Example Round memento used inside a Game memento
const currentRoundMemento = {
  players: [PlayerNames.player1, PlayerNames.player2, PlayerNames.player3],
  hands: [
    [
      { Type: Type.Wild },
      { Type: Type.DrawTwo, Color: Colors.Green },
    ],
    [{ Type: Type.Numbered, Color: Colors.Red, CardNumber: 7 }],
    [{ Type: Type.Skip, Color: Colors.Red }],
  ],
  drawPile: [{ Type: Type.WildDrawFour }],
  discardPile: [
    { Type: Type.Numbered, Color: Colors.Blue, CardNumber: 7 },
    { Type: Type.Skip, Color: Colors.Blue },
  ],
  currentColor: Colors.Blue,
  currentDirection: "clockwise",
  dealer: 2,
  playerInTurn: 1,
}

// Game memento (unfinished game)
const unoMemento = {
  players: [PlayerNames.player1, PlayerNames.player2, PlayerNames.player3],
  currentRound: currentRoundMemento,
  targetScore: 500,
  scores: [220, 430, 80],
  cardsPerPlayer: 7,
}

describe("create unfinished game from valid memento", () => {
  let game = createGameFromMemento(unoMemento)
  beforeEach(() => {
    game = createGameFromMemento(unoMemento)
  })

  it("reads the players from the memento", () => {
    expect(game.getPlayer(0).name).toEqual(PlayerNames.player1)
    expect(game.getPlayer(1).name).toEqual(PlayerNames.player2)
    expect(game.getPlayer(2).name).toEqual(PlayerNames.player3)
  })

  it("reads the round from the memento", () => {
    expect(game.getCurrentRound()?.toMemento()).toEqual(currentRoundMemento)
  })

  it("reads the target score from the memento", () => {
    expect(game.getTargetScore()).toEqual(500)
  })

  it("reads the scores from the memento", () => {
    expect(game.score(0)).toEqual(220)
    expect(game.score(1)).toEqual(430)
    expect(game.score(2)).toEqual(80)
  })

  it("doesn't declare a winner on an unfinished game", () => {
    expect(game.winner()).toBeNull()
  })

  it("updates on changes in the current round", () => {
    game.getCurrentRound()?.play(0) // last card from player 1
    expect(game.winner()?.name).toEqual(PlayerNames.player2)
  })
})

describe("create game from invalid memento", () => {
  it("fails on too few players", () => {
    expect(() =>
      createGameFromMemento({ ...unoMemento, players: [PlayerNames.player1] })
    ).toThrow()
  })

  it("fails on 0 target score", () => {
    expect(() =>
      createGameFromMemento({ ...unoMemento, targetScore: 0 })
    ).toThrow()
  })

  it("fails on negative scores", () => {
    expect(() =>
      createGameFromMemento({ ...unoMemento, scores: [220, 430, -80] })
    ).toThrow()
  })

  it("fails with fewer scores than players", () => {
    expect(() =>
      createGameFromMemento({ ...unoMemento, scores: [220, 430] })
    ).toThrow()
  })

  it("fails on several winners", () => {
    expect(() =>
      createGameFromMemento({ ...unoMemento, targetScore: 200 })
    ).toThrow()
  })

  it("fails on missing current round in an unfinished game", () => {
    expect(() =>
      createGameFromMemento({ ...unoMemento, currentRound: undefined })
    ).toThrow()
  })
})

// Finished game memento
const finishedUnoMemento = {
  players: [PlayerNames.player1, PlayerNames.player2, PlayerNames.player3],
  targetScore: 500,
  scores: [220, 530, 80],
  cardsPerPlayer: 7,
}

describe("create finished game from valid memento", () => {
  let game = createGameFromMemento(finishedUnoMemento)

  it("doesn't have a current round on a finished game", () => {
    expect(game.getCurrentRound()).toBeUndefined()
  })

  it("reads the scores from the memento", () => {
    expect(game.score(0)).toEqual(220)
    expect(game.score(1)).toEqual(530)
    expect(game.score(2)).toEqual(80)
  })

  it("declares a winner on a finished game", () => {
    expect(game.winner()).toBeDefined()
    expect(game.winner()?.name).toEqual(PlayerNames.player2)
  })
})

describe("toMemento", () => {
  it("an unfinished game returns the Memento used to create it", () => {
    const created = createGameFromMemento(unoMemento)
    expect(created.toMemento()).toEqual(unoMemento)
  })

  it("a finished game returns the Memento used to create it", () => {
    const created = createGameFromMemento(finishedUnoMemento)
    expect(created.toMemento()).toEqual(finishedUnoMemento)
  })
})
