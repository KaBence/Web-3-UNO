import { GameMemento } from "domain/src/model/GameMemento";
import { Game } from "domain/src/model/Game";
import { from_memento, to_memento } from "./memento";
import { Colors } from "Domain/src/model/Card";
import { PlayerNames } from "domain/src/model/Player";

// --- Step 1: Define the new, simpler GameStore interface ---
export interface GameStore {
  getGame(id: number): Promise<GameMemento>;
  getAllGames(): Promise<GameMemento[]>;
  saveGame(game: GameMemento): Promise<GameMemento>;
  deleteGame(id: number): Promise<boolean>;
}

export type StoreError = { type: 'Not Found', key: any } | { type: 'DB Error', error: any };
export type ServerError = { type: 'Forbidden' } | StoreError;

export class ServerModel {
  private store: GameStore;
  private nextId: number;

  constructor(store: GameStore) {
    this.store = store;
    this.nextId = 0;
  }


  async all_active_games(): Promise<Game[]> {
    const mementos = await this.store.getAllGames();
    return mementos
      .filter((m) => m.getCurrentRound() !== null)
      .map((m) => from_memento(m));
  }

async all_pending_games(): Promise<Game[]> {
  const mementos = await this.store.getAllGames();
  return mementos
    .filter(m => !m.getCurrentRound())     
    .map(from_memento);
}
  
  async getGame(id: number): Promise<GameMemento> {
    return this.store.getGame(id);
  }

 
  async createGame(): Promise<GameMemento> {
    this.nextId++;
    const game = new Game(this.nextId);
    return await this.store.saveGame(to_memento(game));
  }
  
  async addPlayer(gameId: number, playerName: string): Promise<GameMemento> {
    const memento = await this.store.getGame(gameId);
    const game = from_memento(memento);

    const nameTaken = game.getPlayers().some((p) => p.getName() === playerName);
    if (nameTaken) {
      throw new Error("Player already in game");
    }
    game.addPlayer(playerName);
    return this.store.saveGame(game.createMementoFromGame());
  }


async removePlayer(gameId: number, playerId: number): Promise<GameMemento | null> {

  const memento = await this.store.getGame(gameId);
  if (!memento) {
    return null; // The game doesn't exist.
  }

  const game = from_memento(memento);

const playerExists = game.getPlayers().some(p => p.getID() === playerId);
  if (!playerExists) {
    return memento; // Player not in the game, return unchanged state.
  }
  
 game.removePlayer(playerId);


  if (game.getPlayers().length === 0) {
    
    await this.store.deleteGame(gameId);
    return null; // Signal that the game was deleted.
  } else {
    const updatedMemento = game.createMementoFromGame(); // or to_memento(game)
    return await this.store.saveGame(updatedMemento);
  }
}
 async startRound(id: number): Promise<GameMemento> {
    const memento = await this.store.getGame(id);
    const game = from_memento(memento);

    if (!game.getPlayers() || game.getPlayers().length < 2) {
      throw new Error("Cannot start a round with one or no players.");
    }

    game.createRound();
    return await this.store.saveGame(to_memento(game));
  }

  async deleteGame(id: number): Promise<boolean> {
      return this.store.deleteGame(id);
  }

  // --- Game Action Methods ---
  async play(gameId: number, cardId: number, chosenColor?: string): Promise<GameMemento> {
    const memento = await this.store.getGame(gameId);
    const game = from_memento(memento);
    const round = game.getCurrentRound();
    if (round) {
      round.play(cardId, chosenColor as Colors);
    }
    return await this.store.saveGame(to_memento(game));
  }
  
  async drawCard(gameId: number): Promise<GameMemento> {
    const memento = await this.store.getGame(gameId);
    const game = from_memento(memento);
    const currentPlayer = game.getCurrentRound()?.getCurrentPlayer();
    game.getCurrentRound()?.draw(1, currentPlayer?.getID()!);
    return await this.store.saveGame(to_memento(game));
  }

  async sayUno(gameId: number, playerId: number): Promise<GameMemento> {
    const memento = await this.store.getGame(gameId);
    const game = from_memento(memento);
    game.getCurrentRound()?.sayUno(playerId);
    return await this.store.saveGame(to_memento(game));
  }

  async accuseUno(gameId: number, accuser: number, accused: number): Promise<GameMemento> {
    const memento = await this.store.getGame(gameId);
    const game = from_memento(memento);
    game.getCurrentRound()?.catchUnoFailure(accuser, accused);
    return await this.store.saveGame(to_memento(game));
  }

  async challangeDrawFor(gameId: number): Promise<GameMemento> {
    const memento = await this.store.getGame(gameId);
    const game = from_memento(memento);
    game.getCurrentRound()?.challengeWildDrawFour(true); // Assumes challenge is successful
    return await this.store.saveGame(game.createMementoFromGame());
  }
}