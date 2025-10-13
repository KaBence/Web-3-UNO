import type { Colors, Type,CardNumber } from "Domain/src/model/Card"
import type { PlayerNames } from "Domain/src/model/Player"
import type { Direction} from "domain/src/Model/Round"

export type PlayerSpecs = {
  name:String
  unoCalled:Boolean
  hand:HandSpecs
  playername:PlayerNames
}

export type GameSpecs = {
  id:number
  players:PlayerSpecs[]
  currentRound?:RoundSpecs
  scores:Record<PlayerNames,Number>
  dealer:number
  winner?: string | null;

}

export type RoundSpecs = {
  players:PlayerSpecs[]
  drawDeckSize: number
  topCard:CardSpecs
  currentDirection:Direction
  winner:PlayerNames
  currentPlayer:PlayerNames
  statusMessage:String
}

export type CardSpecs = {
  type:Type
  color:Colors
  number: CardNumber
}

export type HandSpecs = {
  cards:CardSpecs[]
}
