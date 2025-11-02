import type { Colors, Type,CardNumber } from "Domain/src/model/Card"
import type { PlayerNames } from "Domain/src/model/Player"
import type { Direction} from "domain/src/Model/Round"

export type PlayerSpecs = {
  name:string
  unoCalled:Boolean
  hand:HandSpecs
  playerName:PlayerNames
}

export type GameSpecs = {
  id:number
  players:PlayerSpecs[]
  currentRound?:RoundSpecs
  scores:Record<PlayerNames,Number>
  dealer:number
  winner?: PlayerNames | undefined;
}

export type RoundSpecs = {
  players:PlayerSpecs[]
  drawDeckSize: number
  topCard:CardSpecs
  currentDirection:Direction
  winner:PlayerNames
  currentPlayer:PlayerNames
  statusMessage:string
}

export type CardSpecs = {
  type:Type
  color:Colors
  number: CardNumber
}

export type HandSpecs = {
  cards:CardSpecs[]
}
