import { Player } from "../../../Domain/src/model/Player";
import { Hand } from "../../../Domain/src/model/Hand";
import { WildCard, Type } from "../../../Domain/src/model/Card";

export async function getPlayers(): Promise<Player[]> {

    const cards1 = new WildCard(Type.Wild);
    const cards2 = new WildCard(Type.Wild);

    const hand1 = new Hand([cards1]);
    const hand2 = new Hand([cards1, cards2]);

    const player1 = new Player(1,"Player 1");
    const player2 = new Player(2, "PLayer 2");

    player1.setHand(hand1)
    player2.setHand(hand2)

    console.log("Hand before adding "+hand2.getCards().length);
    hand2.addCard(cards2);
    console.log("Hand after adding "+hand2.getCards().length);

  return [player1, player2];
}


export async function getDirection(): Promise<number> {
  //will get arrow direction from backend
  return 0; 
}

export async function playAfterDraw(action: boolean): Promise<void> {
    if (action) {
        console.log("Player chose to play after draw");
        return;
    }
    console.log("Player chose to skip after draw");

}

export async function challengDrawFour(action: boolean): Promise<void> {
    if (action) {
        console.log("Player chose to challege draw four");
        return;
    }
    console.log("Player chose to draw four");

}

export async function selectColor(action: string): Promise<void> {
    
switch(action) {
  case "red":
    console.log("Player chose red");
    break;
  case "blue":
    console.log("Player chose blue");
    break;
  case "green":
    console.log("Player chose green");
    break;
  case "yellow":
    console.log("Player chose yellow");
    break;
  default:
    console.log("HOw kurwa?!");
}

}