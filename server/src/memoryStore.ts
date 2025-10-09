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

  addGame(game: GameMemento): Promise<GameMemento> {
    throw new Error("Method not implemented.");
  }
  async updateGame(game: GameMemento): Promise<GameMemento> {
    const index = this.activeGames.findIndex((g) => g.getId() === game.getId());
    if (index === -1) throw not_found(game.getId());
    this.activeGames[index] = game;
    return game;
  }
  getPendingGame(id: string): Promise<GameMemento> {
    throw new Error("Method not implemented.");
  }
  deletePendingGame(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updatePendingGame(pending: GameMemento): Promise<GameMemento> {
    throw new Error("Method not implemented.");
  }


  public async addPendingGame(game: GameMemento) {
    await this.pendingGames.push(game);
    return game;
  }


}
