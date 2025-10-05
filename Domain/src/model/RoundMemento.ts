import { PlayerNames } from "./Player";
import { Direction } from "./round";
import { PlayerMemento } from "./PlayerMemento";
import { DeckMemento } from "./DeckMemento";

export class RoundMemento {
  private readonly drawPile: DeckMemento;
  private readonly discardPile: DeckMemento;
  private readonly players: PlayerMemento[];
  private readonly currentPlayer: PlayerNames;
  private readonly currentDirection: Direction;
  private readonly roundWinner?: PlayerMemento;

  constructor(
    players: PlayerMemento[],
    drawPile: DeckMemento,
    discardPile: DeckMemento,
    currentPlayer: PlayerNames,
    currentDirection: Direction,
    roundWinner?: PlayerMemento
  ) {
    this.players = players;
    this.currentDirection = currentDirection;
    this.currentPlayer = currentPlayer;
    this.drawPile = drawPile;
    this.discardPile = discardPile;
    this.roundWinner = roundWinner
  }
  //Getters and Setters

  getDrawPile(): DeckMemento {
    return this.drawPile;
  }

  getDiscardPile(): DeckMemento {
    return this.discardPile;
  }

  getPlayers(): PlayerMemento[] {
    return [...this.players];
  }

  getCurrentPlayer(): PlayerNames {
    return this.currentPlayer;
  }

  getCurrentDirection(): Direction {
    return this.currentDirection;
  }

  getWinner(): PlayerMemento | undefined {
    return this.roundWinner;
  }
}
