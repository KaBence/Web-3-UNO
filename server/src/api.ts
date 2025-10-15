
import { GameStore, ServerModel } from "./serverModel"
import { Game } from "../../Domain/src/model/Game"
import { from_memento, to_memento } from "./memento";

interface Broadcaster {
  gameAdded(game: Game): void;
  gameUpdated(game: Game): void;
  gameRemoved(gameId: number, from: 'pending' | 'active'): void;
}

export class GameAPI {
  private server: ServerModel;
  private broadcaster: Broadcaster;

  constructor(broadcaster: Broadcaster, store: GameStore) {
    this.server = new ServerModel(store);
    this.broadcaster = broadcaster;
  }

  async getPendingGames(): Promise<Game[]> {
    return await this.server.all_pending_games();
  }

  async getActiveGames(): Promise<Game[]> {
    return await this.server.all_active_games();
  }

  /** Add a player to a pending game */
  async addPlayer(gameId: number, playerName: string) {
    const updated = await this.server.addPlayer(gameId, playerName);
    const game = new Game(updated.getId(), updated);

    await this.broadcaster.gameUpdated(game);
    return updated;
  }

  /** Remove a player from a pending game */
  /**
   * Orchestrates removing a player from any game (pending or active).
   */
  async removePlayer(gameId: number, playerId: number): Promise<Game | null> {
    // Step 1: Get the game's state *before* it's potentially deleted.
    // This is crucial for broadcasting to the correct feed later.
    const gameBefore = from_memento(await this.server.getGame(gameId));
    if (!gameBefore) {
      // If the game doesn't exist, we can't do anything.
      return null;
    }
    const isPending = gameBefore.getCurrentRound() === undefined;

    // Step 2: Call the server model. It will handle all the complex logic
    // and will return null if the game was deleted.
    const updatedMemento = await this.server.removePlayer(gameId, playerId);

    // Step 3: Broadcast the result of the operation.
    if (updatedMemento === null) {
      // The ServerModel told us the game was deleted.
      // We use the 'isPending' flag we saved earlier to broadcast to the correct feed.
      this.broadcaster.gameRemoved(gameId, isPending ? 'pending' : 'active');
      return null;
    } else {
      // The ServerModel gave us an updated game state.
      const gameAfter = from_memento(updatedMemento);
      this.broadcaster.gameUpdated(gameAfter);
      return gameAfter;
    }
  }
  /** Start the first round and activate the game */
  async startRound(gameId: number): Promise<Game> {
    const gameMemento = await this.server.startRound(gameId)
    const game = from_memento(gameMemento)
    this.broadcaster.gameAdded(game);
    this.broadcaster.gameRemoved(gameId, 'pending');


    return game
  }



  /** Handle playing a card */
  async playCard(gameId: number, cardId: number, chosenColor?: string): Promise<Game> {
    const memento = await this.server.play(gameId, cardId, chosenColor)
    const game = from_memento(memento)
    this.broadcaster.gameUpdated(game);
    return game;

    //  game.roundFinished();
  }

  /** Draw a card */
  async drawCard(gameId: number): Promise<Game> {
    const gameMemento = await this.server.drawCard(gameId)
    const game = from_memento(gameMemento)

    this.broadcaster.gameUpdated(game);
    return game
  }

  /** Simple UNO call , the logic should be in the servermodel not here and I should broadcast it */


  async unoCall(gameId: number, playerId: number): Promise<Game> {
    try {
      await this.server.sayUno(gameId, playerId)
      const gameMemento = await this.server.getGame(gameId);
      const game = from_memento(gameMemento);
      this.broadcaster.gameUpdated(game);
      return game
    }
    catch (error: any) {
      throw new Error(error.message)
    }

  }

  async accuseUno(gameId: number, accuser: number, accused: number): Promise<Game> {

    try {
      await this.server.accuseUno(gameId, accuser, accused)
      const gameMemento = await this.server.getGame(gameId);
      const game = from_memento(gameMemento);
      this.broadcaster.gameUpdated(game);
      return game
    }
    catch (error: any) {
      throw new Error(error.message)
    }

  }

  async challengeDraw4(gameId: number): Promise<Game> {
    const memento = await this.server.challangeDrawFor(gameId);
    const game = from_memento(memento);
    this.broadcaster.gameUpdated(game);
    return game
  }


  async createGame(): Promise<Game> {
    try {
      const game = from_memento(await this.server.createGame());
      this.broadcaster.gameAdded(game);
      return game;
    }
    catch (error: any) {
      throw new Error(error.message);
    }
  }
}