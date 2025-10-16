import { GameMemento } from "domain/src/model/GameMemento";
import { GameStore, StoreError } from "./serverModel";


const not_found = (key: any): StoreError => ({ type: "Not Found", key });


export class MemoryStore implements GameStore {
  private games = new Map<number, GameMemento>();

 
  async getGame(id: number): Promise<GameMemento> {
    const game = this.games.get(id);
    if (!game) throw not_found(id);
    return game;
  }


  async getAllGames(): Promise<GameMemento[]> {
    return Array.from(this.games.values());
  }


  async saveGame(game: GameMemento): Promise<GameMemento> {
    this.games.set(game.getId(), game);
    return game;
  }


  async deleteGame(id: number): Promise<boolean> {
    return this.games.delete(id);
  }
}
