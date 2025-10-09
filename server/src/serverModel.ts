import { GameMemento } from "domain/src/model/GameMemento";
import { MemoryStore } from "./memoryStore";
import { Game } from "domain/src/model/Game";
import { from_memento, to_memento } from "./memento";




export type StoreError = { type: 'Not Found', key: any } | { type: 'DB Error', error: any }

export type ServerError = { type: 'Forbidden' } | StoreError


export interface GameStore {
  getActiveGames(): Promise<GameMemento[]>
  getGame(id: number): Promise<GameMemento>
  addGame(game: GameMemento):  Promise<GameMemento>
  updateGame(game: GameMemento):  Promise<GameMemento>
  
  getPendingGames(): Promise<GameMemento[] >
  getPendingGame(id: string): Promise<GameMemento>
  addPendingGame(game: GameMemento): Promise<GameMemento>
  deletePendingGame(id: string): Promise<void>
  updatePendingGame(pending: GameMemento): Promise<GameMemento>
}


export class ServerModel {
  private store: GameStore
  private nextId: number

  constructor(store:GameStore) {
    this.store = new MemoryStore()
    this.nextId=0
  }

 // all_games() {
 //   return this.store.getAllGames()
 // }
  async all_active_games(): Promise<Game[]> {
  const mementos: GameMemento[] = await this.store.getActiveGames();
  const games: Game[] = [];

  for (const m of mementos) {
    games.push(from_memento(m));
  }

  return games;
}


  async all_pending_games():Promise<Game[]> {
   let mementos:GameMemento[]= await this.store.getPendingGames()
   let games:Game[] = []
   for (let m of mementos){
    games.push(from_memento(m))
   }
   return games
  }
  
  
  async getGame(id: number) {
    return this.store.getGame(id)
  }

  async pending_game(id: string) {
    return this.store.getPendingGame(id)
  }

  async updateGame(memento: GameMemento): Promise<GameMemento> {
  return this.store.updateGame(memento);
 }



  async sayUno (gameId:number, playerId:number):Promise<GameMemento>{
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
 
  async accuseUno(gameId:number, accuser:number, accused:number):Promise<GameMemento>{
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

 
  
    createGame(){
    this.nextId++
    const game = new Game(this.nextId)
    return this.store.addPendingGame(game.createMementoFromGame())
  }










}


