// PlayerMemento.ts
import type { PlayerNames } from "./Player";
import type { Hand } from "./Hand";
import { HandMemento } from "./HandMemento";

export class PlayerMemento {
  constructor(
    private readonly playerName: PlayerNames,
    private readonly name: string,
    private readonly hand: HandMemento,
    private readonly unoCalled: boolean
  ) {}

  // 🧾 Getters — immutable access to snapshot values
  public getId(): PlayerNames {
    return this.playerName;
  }

  public getName(): string {
    return this.name;
  }

  public getHand(): HandMemento {
    // return a shallow copy to avoid external mutation
    return this.hand
  }

  public getUnoCalled(): boolean {
    return this.unoCalled;
  }
}