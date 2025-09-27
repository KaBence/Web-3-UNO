import { DrawPile } from "./Deck";
import { DiscardPile } from "./Deck";
import { Colors } from "./Colors";
import {Hand} from "./Hand";
import { Player, PlayerNames } from "./Player";
import {Card,Type} from "./Card";
import { ShuffleBuilder } from "../../__test__/utils/shuffling";


export enum Direction {
  Clockwise = "clockwise",
  CounterClockwise = "counterclockwise",
}


export class Round {
        private drawPile: DrawPile;
        private discardPile: DiscardPile; //dont we need corrent color as well fdor wild cards?
        private players: Player[];
        private currentPlayer: Player //where aree we settin current player?
        private currentDirection: Direction; //will be replased with enum
        private dealer: number;
        private cardsPerPlayer: number;
        //private status: boolean; play is taking care of +2 and canPlay will check if i can play smth or if i have to draw
    
    constructor(players: Player[], dealer: number, shuffler: ShuffleBuilder, cardsPerPlayer: number) {
        this.drawPile = new DrawPile();
        this.discardPile = new DiscardPile();
        this.players = players;
        this.currentDirection = Direction.Clockwise;
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

    getCurrentDirection(): Direction {
    return this.currentDirection;
    }

    setCurrentDirection(direction: Direction): void {
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


    //bb
    // is it just checking what is the current card?
    currentCard() : Card {
        return this.discardPile.peek(); //! 
    }

    //currentPlayer() : Player {} //why do we need that?
  


   //is it for has ended the game or the round?
    roundHasEnded() : boolean {
        try{
        //for (let i = 0; i < this.players.length; i++) {
        //    if(this.players[i].getHand().size() === 0)
        //        return true;
        //}

        let hasNoCards = this.players.some(player => player.getHand().size() === 0);

        if (hasNoCards) {
            return true;
        }
        return false;
        }catch (error) {
            throw new Error("Error checking if the round has ended: " + error);
        }
    }

 // do we need the gane has ended function?


//should it be called every time a move has been ma
    winner(): Player {
        try{
            if (!this.roundHasEnded()) {
            throw new Error("The round has not ended yet. There is no winner.");
      }

        const winner = this.players.find(p => p.getHand().size() === 0);

      if (!winner) {
        throw new Error("No winner, but the round is marked as ended. Sth went wrong.");
      }

        return winner;
    } 
    catch (error) {
        throw new Error("Error determining the winner: " + error);
    }
    }


    //catchUnoFailuere)() this is responsible for a situation when an accuser player says that the accused has not said uno. if that is true so if the accussed has one card the accussed has to draw 4 cards if the accuser was wrong then they have to draw 6 cards from the draw deck

    catchUnoFailure(accuser: Player, accused: Player): void {
        try {
            if (accuser === accused) {
                throw new Error("A player cannot accuse themselves.");
            }

            const accusedPlayer = this.getSpecificPlayer(accused);
            const accusedHand = this.getPlayerHand(accused);

            const failedToSayUno = accusedHand.size() === 1 && !accusedPlayer.getUno();

            if (failedToSayUno) {
            // Accuser is right → accused draws 4
            accusedHand.drawCards(4);
            accusedPlayer.setUno(false); // reset UNO state
            } else {
            // Accuser is wrong → accuser draws 6
            this.getPlayerHand(accuser).drawCards(6);
        }
        } catch (error) {
            throw new Error("Error during UNO accusation: " + error);
        } //Implement another catch,looking for player not found error or similar
    }


    // and is play set
    play(card: Card, colours?: Colors) : boolean {  //also takes an optional color enum for wildcards
        const playerHand: Hand = this.getPlayerHand(this.currentPlayer);
        if(playerHand.size == 0) { 
            throw Error("Player has no cards to play")
        }

        if(playerHand.getCards().find(c => c === card) == undefined) {
            throw Error("Player does not have that card")
        }


        if(!this.canPlay(card)) 
            return false;    
        this.getSpecificPlayer(this.currentPlayer).getHand().removeCard(card); 
        this.discardPile.push(card);
        this.getSpecificPlayer(this.currentPlayer).setUno(false); //if player plays card his turn has ended? he cant say uno anymore.? cos in the code we said uno hasto be said at the round when they have 2 cards
       
        //special cards execution
        switch (card.getType()) {         
            case Type.Skip:
                this.currentPlayer = this.getNextPlayer().valueOf;
                break;
            case Type.Reverse:
                this.currentDirection = this.currentDirection === Direction.Clockwise ? Direction.CounterClockwise : Direction.Clockwise; //Is the direction reverse logic implemented somewhere or should it be implemented by me?
                break;
            case Type.DrawTwo:
                this.getPlayerHand(this.getNextPlayer()).drawCards(2);
                this.currentPlayer = this.getNextPlayer().valueOf;
                break;
            case Type.WildDrawFour:
                this.getPlayerHand(this.getNextPlayer()).drawCards(4);
                this.currentPlayer = this.getNextPlayer().valueOf; 
                break;
            case Type.Wild:
                if (colours === undefined) {
                    throw new Error("Color must be specified when playing a Wild card.");
                }
                this.currentCard().setColor(colours); //Should the card class have a setColor method?
                break;
            case Type.Numbered:
                if(card.getColor() !== this.currentCard.getColor() && card.getNumber() !== this.currentCard.getNumber()) {
                    throw Error("You can only play a numbered card that matches the color or number of the current card.")
                }
                this.discardPile.addCart(card);
                this.currentPlayer = this.getNextPlayer().valueOf; 
                break;
            default:
                throw("Unexpected move not coverd by the logic")

        }
    }   
    //bb


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