import { GameMemento } from "Domain/src/model/GameMemento";
import { GameStore, StoreError } from "./serverModel";

const not_found = (key: any): StoreError => ({ type: "Not Found", key });

export class MemoryStore implements GameStore {
  private games: GameMemento[];
  private pendingGames: GameMemento[];

  constructor() {
    this.games = [];
    this.pendingGames = [];
  }
  async getAllGames(): Promise<GameMemento[]> {
    return [...this.games];
  }

  async getPendingGames() {
    return [...this.pendingGames];
  }
  getGame(id: number): Promise<GameMemento> {
    throw new Error("Method not implemented.");
  }
  addGame(game: GameMemento): Promise<GameMemento> {
    throw new Error("Method not implemented.");
  }
  updateGame(game: GameMemento): Promise<GameMemento> {
    throw new Error("Method not implemented.");
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

  //   async public getAllGames() {
  //     return [...this.games];
  //   }

  //   async public getPendingGames() {
  //     return [...this.pendingGames];
  //   }

  //   async public getGame(id: number) {
  //     let game = this.games.find((g) => g.getId() === id);
  //     return game ? game : []
  //   }

  //   public getPendingGame(id: number) {
  //     let game = this.pendingGames.find((g) => g.getId() === id);
  //     return game ? ServerResponse.ok(game) : ServerResponse.error(not_found(id));
  //   }

  public async addPendingGame(game: GameMemento) {
    await this.pendingGames.push(game);
    return game;
  }

  //   public addGame(id:number){
  //     let pendingGame = this.getPendingGame(id)
  //     if(pendingGame){
  //         this.deletePendingGame(id)
  //         this.games.push(pendingGame.)
  //     }
  //   }

  //   public updateGame(game: GameMemento) {}

  //   public updatePendingGame(game: GameMemento) {}

  //   public deletePendingGame(id: number) {}

  //   public deleteGame(id: number) {}
}
