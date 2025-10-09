import { GameMemento } from "domain/src/model/GameMemento";
import { MemoryStore } from "./memoryStore";
import { Game } from "domain/src/model/Game";
import { from_memento, to_memento } from "./memento";




export type StoreError = { type: 'Not Found', key: any } | { type: 'DB Error', error: any }

export type ServerError = { type: 'Forbidden' } | StoreError


export interface GameStore {
  getActiveGames(): Promise<GameMemento[]>;
  getGame(id: number): Promise<GameMemento>;
  addGame(game: GameMemento): Promise<GameMemento>;
  updateGame(game: GameMemento): Promise<GameMemento>;

  getPendingGames(): Promise<GameMemento[]>;
  getPendingGame(id: number): Promise<GameMemento>;
  addPendingGame(game: GameMemento): Promise<GameMemento>;
  deletePendingGame(id: number): Promise<void>;
  updatePendingGame(pending: GameMemento): Promise<GameMemento>;
}

export class ServerModel {
  private store: GameStore;
  private nextId: number;

  constructor(store: GameStore) {
    this.store = store;
    this.nextId = 0;
  }

  async all_active_games(): Promise<Game[]> {
    const mementos: GameMemento[] = await this.store.getActiveGames();
    const games: Game[] = [];

    for (const m of mementos) {
      games.push(from_memento(m));
    }

    return games;
  }


  async all_pending_games(): Promise<Game[]> {
    let mementos: GameMemento[] = await this.store.getPendingGames();
    let games: Game[] = [];
    for (let m of mementos) {
      games.push(from_memento(m));
    }
    return games;
  }

  async getGame(id: number): Promise<GameMemento> {
    return this.store.getGame(id);
  }

  async getPendingGame(id: number): Promise<GameMemento> {
    return this.store.getPendingGame(id);
  }

  async updateGame(memento: GameMemento): Promise<GameMemento> {
    return this.store.updateGame(memento);
  }

  async createGame(): Promise<GameMemento> {
    this.nextId++;
    const game = new Game(this.nextId);

    return this.store.addPendingGame(game.createMementoFromGame());
  }

  async sayUno(gameId: number, playerId: number): Promise<GameMemento> {
    const gameMemento = await this.store.getGame(gameId);
    const game = from_memento(gameMemento);
    const round = game.getCurrentRound();
    if (!round) {
      throw new Error("No active round");
    }
    round.sayUno(playerId);
    const updatedMemento = to_memento(game);
    await this.store.updateGame(updatedMemento);
    return updatedMemento;
  }

  async accuseUno(gameId: number, accuser: number, accused: number): Promise<GameMemento> {
    const gameMemento = await this.store.getGame(gameId);
    const game = from_memento(gameMemento);
    const round = game.getCurrentRound();
    if (!round) {
      throw new Error("No active round");
    }
    round.catchUnoFailure(accuser, accused);
    const updatedMemento = to_memento(game);
    await this.store.updateGame(updatedMemento);
    return updatedMemento;
  }

  async startRound(id: number): Promise<GameMemento> {
    const memento = await this.store.getPendingGame(id)
    const game = from_memento(memento)
    this.store.deletePendingGame(id);
    ///////////////////////////////////////////////
    game.addPlayer("asd")
    game.addPlayer("Hello")
    //////////////////////////////////////////////
    game.createRound()

    return this.store.addGame(game.createMementoFromGame());
  }

  async drawCard(gameId: number): Promise<GameMemento> {
    const memento = await this.store.getGame(gameId)
    const game = from_memento(memento)
    let currentPlayer = game.getCurrentRound()?.getCurrentPlayer()
    game.getCurrentRound()?.draw(1, currentPlayer?.getID()!)

    return await this.store.updateGame(game.createMementoFromGame())
  }

}


