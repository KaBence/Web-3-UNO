import { GameMemento } from "Domain/src/model/GameMemento";
import { Game } from "Domain/src/model/Game";


export function from_memento(m: GameMemento): Game {
  let game = new Game(m.getId(), m);
  return game;
}

export function to_memento(g: Game): GameMemento {
  return g.createMementoFromGame()
}

