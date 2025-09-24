import { DrawPile } from "./Deck";
import { DiscardPile } from "./Deck";
import { Player } from "./Player";
import { Card } from "./Card";
import {Hand} from "./Deck";
import { ShuffleBuilder } from "../../__test__/utils/shuffling";

export class Round {
        drawPile: DrawPile;
        discardPile: DiscardPile; //dont we need corrent color as well fdor wild cards?
        players: Player[];
        currentPlayer: number //where aree we settin current player?
        currentDirection: "clockwise" | "counter-clockwise";
        dealer: number;
        cardsPerPlayer: number;
        status: boolean; //are +2, +4 or skips  executed
    
    constructor(players: Player[], dealer: number, shuffler: ShuffleBuilder, cardsPerPlayer: number) {
        this.drawPile = new DrawPile();
        this.discardPile = new DiscardPile();
        this.players = players;
        this.currentDirection = "clockwise";
        this.dealer = dealer;
        this.currentPlayer = (dealer + 1) % this.players.length; //should be next player after dealer
        this.cardsPerPlayer = cardsPerPlayer;
        this.status = false;
    }

    playerHand(player:number) : Hand {
        return this.players.find(p => p.id === player)?.hand!;
    }

    draw() : void {
        const card = this.drawPile.top();
        this.players.find(p => p.id === this.currentPlayer)?.hand.addCard(card); //we need stuff for hand (addCard playCard getCard)
    }

    sayUno(player:number) : void {
        this.players.find(p => p.id === player)?.setUno(true);
    }

    canPlay(card:number) : boolean { //inst is easier by passing whole card?      
        if (this.status) return false; //if +2, +4 or skip is active and play should automaticly skip or give cards
        const top = this.discardPile.peek();
        const playerCard = this.players.find(p => p.id === this.currentPlayer)?.hand.getCard(card);
        return ( 
            playerCard.Color === top.Color || 
            playerCard.CardNumber === top.CardNumber ||  
            playerCard.Type === "WILD" || 
            playerCard.type === "WILD DRAW"
        );
    }

    challengeWildDrawFour(): void {
        const currentIndex = this.players.findIndex(p => p.id === this.currentPlayer);
        const prevIndex = (currentIndex - 1 + this.players.length) % this.players.length;
        const prevPlayer = this.players[prevIndex];
        const prevHand = prevPlayer.hand;
        const prevCard = this.discardPile.peek(-1);

        if (!prevCard) return;

        const brokeRules = prevHand.cards.some(card =>
            this.canPlayCardForPrev(card, prevCard) && card.type !== "WILD DRAW"
        );

        if (brokeRules) {
            prevPlayer.hand.drawCards(4);
            this.players.find(p => p.id === this.currentPlayer)?.hand.drawCards(6);
        }
    }

  
    canPlayCardForPrev(card: Card, top: Card): boolean {
        return (
            card.Type === "NUMBERED" && top.Type === "NUMBERED" && card.CardNumber === top.CardNumber ||
            "Color" in card && "Color" in top && card.Color === top.Color
        );
    }

    specialCardsExecution() : void {
        if (this.status) {
            const top = this.discardPile.peek();
            if (top.Type === "DRAW") {
                this.players.find(p => p.id === this.currentPlayer)?.hand.drawCards(2);
            } else if (top.Type === "WILD DRAW") {
                this.challengeWildDrawFour();
            } else if(top.Type === "SKIP") {
                const currentIndex = this.players.findIndex(p => p.id === this.currentPlayer);
                const nextIndex = (currentIndex + 1) % this.players.length;
                this.currentPlayer = this.players[nextIndex].id; //skip next player
            }
            this.status = false;
        }
    }
}


