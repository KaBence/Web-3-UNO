import { GameMemento } from "domain/src/model/GameMemento";
import { MemoryStore } from "./memoryStore";
import { Game } from "domain/src/model/Game";
import { from_memento, to_memento } from "./memento";




export type StoreError = { type: 'Not Found', key: any } | { type: 'DB Error', error: any }

export type ServerError = { type: 'Forbidden' } | StoreError


export interface GameStore {
  getAllGames(): Promise<GameMemento[]>
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

  all_games() {
    return this.store.getAllGames()
  }

  async all_pending_games():Promise<Game[]> {
   let mementos:GameMemento[]= await this.store.getPendingGames()
   let games:Game[] = []
   for (let m of mementos){
    games.push(from_memento(m))
   }
   return games
  }

//   game(id: string) {
//     return this.store.getGame(id)
//   }

  pending_game(id: string) {
    return this.store.getPendingGame(id)
  }

  createGame(){
    this.nextId++
    const game = new Game(this.nextId)
    return this.store.addPendingGame(game.createMementoFromGame())
  }
}
