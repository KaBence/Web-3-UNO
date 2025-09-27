import { DrawPile } from "./Deck";
import { DiscardPile } from "./Deck";
import {Hand} from "./Hand";
import { Player, PlayerNames } from "./Player";
import {Card,Type} from "./Card";
import { ShuffleBuilder } from "../../__test__/utils/shuffling";

export class Round {
        private drawPile: DrawPile;
        private discardPile: DiscardPile; //dont we need corrent color as well fdor wild cards?
        private players: Player[];
        private currentPlayer: PlayerNames //where aree we settin current player?
        private currentDirection: "clockwise" | "counter-clockwise"; //will be replased with enum
        private dealer: number;
        private cardsPerPlayer: number;
        //private status: boolean; play is taking care of +2 and canPlay will check if i can play smth or if i have to draw
    
    constructor(players: Player[], dealer: number, shuffler: ShuffleBuilder, cardsPerPlayer: number) {
        this.drawPile = new DrawPile();
        this.discardPile = new DiscardPile();
        this.players = players;
        this.currentDirection = "clockwise";
        this.dealer = dealer;
        this.currentPlayer = (dealer + 1) % this.players.length; //should be next player after dealer
        this.cardsPerPlayer = cardsPerPlayer;
    }

    //Getters and Setters

    getDrawPile() : DrawPile {
        return this.drawPile;
    }

    setDrawPile(drawPile: DrawPile) : void {
        this.drawPile = drawPile;
    }

    getDiscardPile() : DiscardPile {
        return this.discardPile;
    }

    setDiscardPile(discardPile: DiscardPile) : void {
        this.discardPile = discardPile;
    }

    getPlayers() : Player[] {
        return this.players;
    }

    getSpecificPlayer(player: PlayerNames): Player {
        const specificPlayer =  this.players.find(p => p.getID === player.valueOf);
        if (specificPlayer != undefined) return specificPlayer;
        throw Error("Player not found!")
    }

    setPlayers(players: Player[]) : void {
        this.players = players;
    }

    getCurrentPlayer() : number {
        return this.currentPlayer;
    }

    setCurrentPlayer(player: number) : void {
        this.currentPlayer = player;
    }

    getCurrentDirection() : "clockwise" | "counter-clockwise" { //will be replased with enum
        return this.currentDirection;
    }

    setCurrentDirection(direction: "clockwise" | "counter-clockwise") : void {
        this.currentDirection = direction;
    }

    getDealer() : number {
        return this.dealer;
    }

    setDealer(dealer: number) : void {
        this.dealer = dealer;
    }

    getCardsPerPlayer() : number {
        return this.cardsPerPlayer;
    }

    setCardsPerPlayer(cards: number) : void {
        this.cardsPerPlayer = cards;
    }

    getPlayerHand(player:PlayerNames) : Hand {
        return this.players.find(p => p.getID === player.valueOf)?.getHand()!;
    }

    //Game logic methods

    draw() : void { //call play with that card (play should check if can play) and return true if it was played
        const card = this.drawPile.top();
        this.getSpecificPlayer(this.currentPlayer).setUno(false);
        if(this.play(card)) 
            return //pls play take a card not a number
        this.getSpecificPlayer(this.currentPlayer).getHand().addCard(card);
    }

    sayUno(player:PlayerNames) : void {
        const specificPlayer = this.getSpecificPlayer(player)
        if(specificPlayer.getHand().size() != 1) {
            specificPlayer.getHand().addCard() //should that be in for loop or should it have 4 as argument
            return
        }
        specificPlayer.setUno(true);
    }

    canPlay(card:Card) : boolean { //this.currentCard() to be implemented by Basia   
        switch (card.getType()) {         
            case Type.Skip || Type.Reverse || Type.DrawTwo:
                if(this.currentCard().getType() === card.getType() || this.currentCard().getColor() === card.getColor())
                    return true;
                return false;

            case Type.Wild || Type.WildDrawFour:
                return true;

            case Type.Numbered:
                if(this.currentCard().getNumber() === card.getNumber() || this.currentCard().getColor() === card.getColor())
                    return true;
                return false;

            default:
                throw("Unexpected move not coverd by the logic")
        }
    }

    challengeWildDrawFour(): void {
        if(this.couldPlayInstedofDrawFour()) {
            this.getPlayerHand(this.getNextPlayer()).drawCards(6);
        }
        else {
            this.getPlayerHand(this.currentPlayer).drawCards(4);
        }
        //do we want to add function nextPlayer()? that will change current player to next player based on getNextPlayer() annd it will call play()
    }

    //Helper functions

    getNextPlayer() : PlayerNames {
        let index = 0;
        if(this.getCurrentDirection() === "clockwise") { //will be changed to enum
            index = (this.players.findIndex(p => p.getID === this.currentPlayer.valueOf) + 1) % this.players.length;
        }
        else {
            index = (this.players.findIndex(p => p.getID === this.currentPlayer.valueOf) - 1) % this.players.length;
        }
        
        return this.getPlayerHand(this.players[index].getID());
    }

    couldPlayInstedofDrawFour() : boolean { 
        const hand = this.getPlayerHand(this.getNextPlayer()).getCards();

        for (let i = 0; i < hand.size(); i++) {
            switch (hand[i].getType()) {         
                case Type.Skip || Type.Reverse || Type.DrawTwo:
                    if(this.currentCard().getType() === hand[i].getType() || this.currentCard().getColor() ===  hand[i].getColor())
                        return true;
                    break;

                case Type.Wild || Type.WildDrawFour:
                    break;

                case Type.Numbered:
                    if(this.currentCard().getNumber() ===  hand[i].getNumber() || this.currentCard().getColor() ===  hand[i].getColor())
                        return true;
                    break;

                default:
                    break;
            }
        }
        return false;
    }
    




    //not my part - can be used as inspiration for part of the play function
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


