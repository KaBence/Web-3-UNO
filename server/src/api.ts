
import { GameStore, ServerModel } from "./serverModel"
import { Game } from "../../Domain/src/model/Game"
import { from_memento, to_memento } from "./memento";

export interface Broadcaster {
  send: (message: Game) => Promise<void>
}

export class GameAPI {
  private server: ServerModel;
  private broadcaster: Broadcaster;

  constructor(broadcaster: Broadcaster, store: GameStore) {
    this.server = new ServerModel(store);
    this.broadcaster = broadcaster;
  }

  async getPendingGames(): Promise<Game[]> {
    return this.server.all_pending_games();
  }

  async getActiveGames(): Promise<Game[]> {
    return this.server.all_active_games();
  }

  /** Add a player to a pending game */
  async addPlayer(gameId: string, playerName: string): Promise<Game> {

    throw new Error("Method not implemented.");
  }

  /** Remove a player from a pending game */
  async removePlayer(gameId: string, playerName: string): Promise<Game> {

    throw new Error("Method not implemented.");
  }

  /** Start the first round and activate the game */
  async startRound(gameId: number): Promise<Game> {
    const gameMemento = await this.server.startRound(gameId)
    const game = from_memento(gameMemento)
   
    this.broadcast(game);
    return game
  }

  /** Handle playing a card */
  async playCard(gameId: string, cardId: number, chosenColor?: string): Promise<Game> {
    throw new Error("Method not implemented.");

  }

  /** Draw a card */
  async drawCard(gameId: number): Promise<Game> {
    const gameMemento = await this.server.drawCard(gameId)
    const game = from_memento(gameMemento)
   
    this.broadcast(game);
    return game
  }

  /** Simple UNO call , the logic should be in the servermodel not here and I should broadcast it */


  async unoCall(gameId: number, playerId: number): Promise<Game> {
    try {
      await this.server.sayUno(gameId, playerId)
      const gameMemento = await this.server.getGame(gameId);
      const game = from_memento(gameMemento);
      this.broadcast(game)
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
      this.broadcast(game)
      return game
    }
    catch (error: any) {
      throw new Error(error.message)
    }

  }

  async challengeDraw4(gameId: string): Promise<Game> {

    throw new Error("Method not implemented.");
  }

  async broadcast(game: Game): Promise<void> {
    this.broadcaster.send(game);
  }

  async createGame(): Promise<Game>{
    try {
      const game = from_memento(await this.server.createGame());
      this.broadcast(game);
      return game;
    } 
    catch (error: any) {
      throw new Error(error.message);
    }
  }
}