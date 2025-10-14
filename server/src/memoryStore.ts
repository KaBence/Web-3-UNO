import { GameMemento } from "Domain/src/model/GameMemento";
import { GameStore, StoreError } from "./serverModel";

const not_found = (key: any): StoreError => ({ type: "Not Found", key });

export class MemoryStore implements GameStore {
  private activeGames: GameMemento[];
  private pendingGames: GameMemento[];

  constructor() {
    this.activeGames = [];
    this.pendingGames = [];
  }


  async deleteActiveGame(id: number): Promise<boolean> {
  const index = this.activeGames.findIndex((g) => g.getId() === id);
  if (index === -1) return false;
  this.activeGames.splice(index, 1);
  return true;
}


  
  async getActiveGames(): Promise<GameMemento[]> {
    return [...this.activeGames];
  }

  async getPendingGames() {
    return [...this.pendingGames];
  }
  async getGame(id: number): Promise<GameMemento> {
    const game = this.activeGames.find((g) => g.getId() === id);
    if (!game) throw not_found(id);
    return game;
  }

  async addGame(game: GameMemento): Promise<GameMemento> {
    this.activeGames.push(game);
    return game;
  }
  
  async updateGame(game: GameMemento): Promise<GameMemento> {
    const index = this.activeGames.findIndex((g) => g.getId() === game.getId());
    if (index === -1) throw not_found(game.getId());
    this.activeGames[index] = game;
    return game;
  }

  async getPendingGame(id: number): Promise<GameMemento> {
    const index = this.pendingGames.findIndex((g) => g.getId() === id);
    if (index === -1) throw not_found(id);
    return this.pendingGames[index];
  }

  async deletePendingGame(id: number): Promise<void> {
    const index = this.pendingGames.findIndex((g) => g.getId() === id);
    if (index === -1) throw not_found(id);
    this.pendingGames.splice(index,1);
  }

  async updatePendingGame(pending: GameMemento): Promise<GameMemento> {
    const index = this.pendingGames.findIndex((g) => g.getId() === pending.getId());
    if (index === -1) throw not_found(pending.getId());
    this.pendingGames[index] = pending;
    return pending;
  }

  async addPendingGame(game: GameMemento): Promise<GameMemento> {
    this.pendingGames.push(game);
    return game;
  }


}
