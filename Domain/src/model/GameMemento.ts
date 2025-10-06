import { Player, PlayerNames } from "./Player";
import { PlayerMemento } from "./PlayerMemento";
import { RoundMemento } from "./RoundMemento";

export class GameMemento {
  private readonly id:number
  private readonly players: PlayerMemento[];
  private readonly currentRound?: RoundMemento;
  private readonly scores: Record<PlayerNames, number>;
  private readonly dealer: number;
  // private readonly isActive: boolean
  private readonly winner?:PlayerNames

  constructor(id:number,scores:Record<PlayerNames,number>,dealer:number,players: PlayerMemento[], round?:RoundMemento,winner?:PlayerNames) {
    this.players = [...players];
    this.scores = {...scores};
    this.dealer = dealer;
    this.currentRound = round 
    this.winner = winner;
    this.id=id;
    // this.isActive=isActive;
  }

  public getPlayers(): PlayerMemento[] {
    // return shallow copy to protect encapsulation
    return [...this.players];
  }

  public getScores(): Record<PlayerNames, number> {
    return { ...this.scores };
  }

  public getCurrentRound(){
    return this.currentRound;
  }

  public getDealer(){
    return this.dealer;
  }

  public getId(){
    return this.id;
  }

  // public getIsActive(){
  //   return this.isActive
  // }

  public getWinner(){
    return this.winner
  }
}
