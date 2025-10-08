
import { GameStore, ServerModel } from "./serverModel"
import { Game } from "../../Domain/src/model/Game"
import { from_memento, to_memento } from "./memento";




export interface Broadcaster {
  send: (message: Game) => Promise<void>
}

export class GameAPI {
  private server: ServerModel
  private broadcaster:Broadcaster

  constructor(broadcaster: Broadcaster,store:GameStore){
    this.server = new ServerModel(store)
    this.broadcaster = broadcaster
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
  async startRound(gameId: string): Promise<Game> {
    throw new Error("Method not implemented.");
   

  }

  /** Handle playing a card */
  async playCard(gameId: string, cardId: number, chosenColor?: string): Promise<Game> {
    throw new Error("Method not implemented.");

  }

  /** Draw a card */
  async drawCard(gameId: string): Promise<Game> {
 
    throw new Error("Method not implemented.");
  }

  /** Simple UNO call */
  async unoCall(gameId: number, playerId: number): Promise<Game> {
   const gameMemento = await this.server.getGame(gameId);
  const game = from_memento(gameMemento);

  const round = game.getCurrentRound();
  if (!round) {
    throw new Error("Current round is undefined.");
  }
  round.sayUno(playerId); 
  await this.server.updateGame(to_memento(game));
  return game;

  }

  async accuseUno(gameId: number, accuser: number, accused: number): Promise<Game> {
    const gameMemento = await this.server.getGame(gameId);
    const game = from_memento(gameMemento);
    const round = game.getCurrentRound();
    if (!round) {
      throw new Error("Current round is undefined.");
    } 
    round.catchUnoFailure(accuser, accused);
    await this.server.updateGame(to_memento(game));
    return game;
  }

  async challengeDraw4(gameId: string): Promise<Game> {
   
    throw new Error("Method not implemented.");
  }

  async broadcast(game: Game): Promise<void> {
    this.broadcaster.send(game)
  }

  

  async createGame() {
    try {
      // 2️ Persist the snapshot
      const game = await this.server.createGame()
      let g = new Game(game.getId())
      g.createGameFromMemento(game)
      this.broadcast(g)
      // 3️ Return a clean API response
      return game
      // return JSON.parse(JSON.stringify(game));
      // return ApiResponse.ok(game, "Game created successfully")
    } 
    catch (error: any) {
      throw new Error(error.message); // GraphQL can handle errors directly
    }
  }
}