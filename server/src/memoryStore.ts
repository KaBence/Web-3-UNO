import { GameMemento } from "domain/src/model/GameMemento";
import { GameStore, StoreError } from "./serverModel";

// helper for consistent "not found" errors
const not_found = (key: any): StoreError => ({ type: "Not Found", key });

/**
 * ✅ MemoryStore — a simple in-memory implementation of GameStore.
 * 
 * This class keeps all games in memory for the lifetime of the server.
 * It supports create, read, update, delete operations, and is safe
 * to share between multiple resolvers / players in one Node process.
 */
export class MemoryStore implements GameStore {
  /** A single Map is the unified source of truth for all games. */
  private games = new Map<number, GameMemento>();

  /**
   * Get a specific game by ID.
   * Throws a typed Not Found error if missing.
   */
  async getGame(id: number): Promise<GameMemento> {
    const game = this.games.get(id);
    if (!game) throw not_found(id);
    return game;
  }

  /**
   * Return all games currently stored (pending + active).
   */
  async getAllGames(): Promise<GameMemento[]> {
    return Array.from(this.games.values());
  }

  /**
   * Save or update a game.
   * If it already exists, overwrite; otherwise, insert.
   */
  async saveGame(game: GameMemento): Promise<GameMemento> {
    this.games.set(game.getId(), game);
    return game;
  }

  /**
   * Delete a game by its ID.
   * Returns true if the game existed and was deleted.
   */
  async deleteGame(id: number): Promise<boolean> {
    return this.games.delete(id);
  }
}
