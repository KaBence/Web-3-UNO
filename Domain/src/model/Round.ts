import { DrawDeck, DiscardDeck } from "./Deck";
import { Hand } from "./Hand";
import { Player, PlayerNames } from "./Player";
import { Card, Type, Colors, SpecialColoredCard } from "./Card";
import { CreateSpecialColoredCard } from "./CardFactory";
import * as randomUtils from "../utils/random_utils";
import { RoundMemento } from "./RoundMemento";
import { PlayerMemento } from "./PlayerMemento";

export enum Direction {
  Clockwise = "clockwise",
  CounterClockwise = "counterclockwise",
}

export class Round {
  private drawPile: DrawDeck;
  private discardPile: DiscardDeck;
  private players: Player[];
  private currentPlayer: PlayerNames;
  private currentDirection: Direction;
  private cardsPerPlayer: number = 7;
  private roundWinner?: PlayerNames;
  private statusMessage: String;
  private topCard:Card;
  private drawDeckSize:number

  constructor(players: Player[], dealer: number, memento?:RoundMemento) {
    if (memento) {
      this.players = []
      for (let playerMem of memento.getPlayers()) {
        this.players.push(new Player(playerMem.getId(),playerMem.getName(),playerMem))
      }
      this.currentDirection = memento.getCurrentDirection();
      this.currentPlayer = memento.getCurrentPlayer();
      this.drawPile = new DrawDeck(memento.getDrawPile().getCards())
      this.discardPile = new DiscardDeck(memento.getDiscardPile().getCards())
      this.topCard = this.discardPile.peek()
      this.drawDeckSize = memento.getDrawDeckSize()
      this.statusMessage = "Round Restored"
      return;
    }
    
    this.players = players;
    this.currentDirection = Direction.Clockwise;
    this.currentPlayer = this.players.length === 0 ? -1 : ((dealer + 1) % this.players.length) + 1; //should be next player after dealer
    
    this.drawPile = new DrawDeck();
    for (let i = 0; i < this.cardsPerPlayer; i++) {
      for (const player of this.players) {
        this.draw(1,player.getID())
      }
    }
    this.discardPile = new DiscardDeck([this.drawPile.deal()!]);
    this.topCard = this.discardPile.peek()
    this.handleStartRound();
    this.statusMessage = "Round Created"
    this.drawDeckSize = this.drawPile.getCards().length
  }
  //Getters and Setters

  getDrawPile(): DrawDeck {
    return this.drawPile;
  }

  setDrawPile(drawPile: DrawDeck): void {
    this.drawPile = drawPile;
  }

  getDiscardPile(): DiscardDeck {
    return this.discardPile;
  }

  setDiscardPile(discardPile: DiscardDeck): void {
    this.discardPile = discardPile;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getSpecificPlayer(player: PlayerNames): Player {
    const specificPlayer = this.players.find((p) => p.getID() === player);
    if (specificPlayer != undefined) return specificPlayer;
    throw Error("Player not found!");
  }

  setPlayers(players: Player[]): void {
    this.players = players;
  }

  getCurrentPlayer(): Player {
    return this.getSpecificPlayer(this.currentPlayer);
  }

  setCurrentPlayer(player: number): void {
    this.currentPlayer = player;
  }

  getCurrentDirection(): Direction {
    return this.currentDirection;
  }

  getCardsPerPlayer(): number {
    return this.cardsPerPlayer;
  }

  getStatusMessage():String{
    return this.statusMessage
  }

  getPlayerHand(player: PlayerNames): Hand | undefined{ 
    let p = this.players.find((p) => p.getID() === player)
    return p ? p.getHand() : undefined
  }

  //Game logic methods

  changeCurrentDirection(): void {
    this.currentDirection = this.currentDirection === Direction.Clockwise ? Direction.CounterClockwise : Direction.Clockwise;
  }

  currentCard(): Card {
    this.topCard = this.discardPile.peek();
    return this.topCard
  }

  getPlayersCard(player: PlayerNames, card: number): Card | undefined {
    let hand = this.getPlayerHand(player)
    return hand ? hand.getCards()[card] : undefined
  }

  roundHasEnded(): boolean {
    return this.players.some((p) => p.getHand().size() === 0);
  }

  //should it be called every time a move has been ma
  winner(): Player | undefined {
    const winner = this.players.find((p) => p.getHand().size() === 0);
    return winner;
  }
  getWinner(): PlayerNames | undefined {
    return this.roundWinner;
  }
  //catchUnoFailuere)() this is responsible for a situation when an accuser player says that the accused has not said uno. if that is true so if the accussed has one card the accussed has to draw 4 cards if the accuser was wrong then they have to draw 6 cards from the draw deck

  catchUnoFailure(accuser: PlayerNames, accused: PlayerNames): void {
    if (!this.getSpecificPlayer(accused).hasUno()) {
      this.draw(4, accused);
    } else {
      // Accuser is wrong → accuser draws 6
      this.draw(6, accuser);
    }
  }

  //also takes an optional color enum for wildcards
  play(cardID: number, colour?: Colors): void {
    const card = this.getPlayersCard(this.currentPlayer, cardID);
    if (card == undefined) {
      console.log("I tried to take a card that doesn't exist, whoops")
      return;
    }
    if (!this.canPlay(cardID)) {
      return
    } 

    this.getCurrentPlayer().getHand().removeCard(card);
    this.discardPile.addCard(card);
    this.currentCard()

    //special cards execution
    switch (card.getType()) {
      case Type.Skip:
        this.currentPlayer = this.getNextPlayer();
        break;
      case Type.Reverse:
        this.changeCurrentDirection();
        break;
      case Type.Draw:
        this.draw(2, this.getNextPlayer());
        this.currentPlayer = this.getNextPlayer();
        break;
      case Type.Wild:
        this.discardPile.addCard(new SpecialColoredCard(Type.Dummy, colour!));
        break;
      case Type.Dummy:
      case Type.WildDrawFour:
      // we don't do anything here because the GUI has to react with challengeWildDrawFour() if the player wants or after 5 seconds no matter what
      case Type.Numbered:
      // we don't do anything because it is covered above the switch
    }

    if (this.roundHasEnded()) {
      const winner = this.winner();
      if (winner) {
        this.roundWinner = winner.getID();
        return;
      }
    }

    this.currentPlayer = this.getNextPlayer();
  }

  draw(noCards: number, playedId: PlayerNames): void {
    for (let i = 0; i < noCards; i++) {
      let card = this.drawPile.deal()!;
      if (this.drawPile.peak() === undefined) {
        let [topCard, ...rest] = this.discardPile.getCards();

        this.discardPile = new DiscardDeck([topCard]);
        let filtered = rest.filter((c) => c.getType() !== Type.Dummy);
        this.drawPile = new DrawDeck(filtered);
        this.drawPile.shuffle(randomUtils.standardShuffler);
      }
      if (this.getSpecificPlayer(playedId).hasUno()) {
        this.getSpecificPlayer(playedId).setUno(false);
      }
      let hand = this.getPlayerHand(playedId)
      if (hand) {
        hand.addCard(card);
      }
      else {
        console.log("Tried to access a player's hand who doesn't exists")
      }
    }
    this.drawDeckSize = this.drawPile.getCards().length
  }

  //if you forget to say uno and it is already the next person's round, you should still be able to call UNO
  sayUno(player: PlayerNames): void {
    const specificPlayer = this.getSpecificPlayer(player);
    const hand = specificPlayer.getHand();
    if (hand.size() === 2) {
      if (this.canPlay(0) || this.canPlay(1)) {
        specificPlayer.setUno(true);
      }
      else{
        this.draw(4, player);
      }
      return;
    }
    if (hand.size() != 1) {
      this.draw(4, player);
      return;
    }
    specificPlayer.setUno(true);
  }

  canPlay(cardId: number): boolean {
    const card = this.getPlayerHand(this.currentPlayer)!.getCards()[cardId];
    switch (card.getType()) {
      case Type.Reverse:
      case Type.Draw:
      case Type.Skip :
        if (this.currentCard().getType() === card.getType() || this.currentCard().getColor() === card.getColor()) {
          return true;
        }
        return false;

      case Type.Wild :
      case Type.WildDrawFour:
        return true;

      case Type.Numbered:
        if (this.currentCard().getType() === card.getType() || this.currentCard().getColor() === card.getColor()){
            return true;
        }
        return false;
      
      case Type.Dummy:
        return false
    }
  }

  challengeWildDrawFour(isChallenged: boolean): void {
    if (!isChallenged) {
      this.draw(4, this.currentPlayer);
      this.currentPlayer = this.getNextPlayer();
      return;
    }

    this.couldPlayInsteadofDrawFour()
      ? this.draw(4, this.getPreviousPlayer())
      : (() => {
          this.draw(6, this.currentPlayer);
          this.currentPlayer = this.getNextPlayer();
        })();
  }

  //Helper functions

  getNextPlayer(): PlayerNames {
    let index = 0;
    if (this.getCurrentDirection() === Direction.Clockwise) 
      index = (this.players.findIndex((p) => p.getID() === this.currentPlayer) + 1) % this.players.length;
    else 
      index = (this.players.findIndex((p) => p.getID() === this.currentPlayer) - 1 + this.players.length) % this.players.length;

    return this.players[index].getID();
  }

  getPreviousPlayer(): PlayerNames {
    let index = 0;
    if (this.getCurrentDirection() === Direction.Clockwise) {
      index =(this.players.findIndex((p) => p.getID() === this.currentPlayer) - 1 + this.players.length) % this.players.length;
    } else {
      index = (this.players.findIndex((p) => p.getID() === this.currentPlayer) + 1) % this.players.length;
    }

    return this.players[index].getID();
  }

  couldPlayInsteadofDrawFour(): boolean {
    const hand = this.getPlayerHand(this.getNextPlayer())!.getCards();

    for (let i = 0; i < hand.length; i++) {
      switch (hand[i].getType()) {
        case Type.Reverse:
        case Type.Draw:
        case Type.Skip:
          if (this.currentCard().getType() === hand[i].getType() || this.currentCard().getColor() === hand[i].getColor()){
            return true;
          }
          break;
        case Type.Wild:
        case Type.WildDrawFour:
          break;
        case Type.Numbered:
          if (this.currentCard().getNumber() === hand[i].getNumber() || this.currentCard().getColor() === hand[i].getColor()){
            return true;
          }
        case Type.Dummy:
      }
    }
    return false;
  }

  handleStartRound(): void {
    const topCard = this.currentCard();

    switch (topCard.getType()) {
      case Type.Skip:
        this.currentPlayer = this.getNextPlayer();
        return;
      case Type.Reverse:
        this.changeCurrentDirection();
        this.currentPlayer = this.getNextPlayer()
        this.currentPlayer = this.getNextPlayer()
        return;
      case Type.Draw:
        this.draw(2,this.currentPlayer)
        this.currentPlayer = this.getNextPlayer()
        return;
      case Type.WildDrawFour:
        let wildcard = this.discardPile.deal()!;
        this.drawPile.addCard(wildcard);
        this.drawPile.shuffle(randomUtils.standardShuffler);
        this.discardPile.addCard(this.drawPile.deal()!);
        this.handleStartRound();
      case Type.Wild:
        // not doing anything in this case, cause the GUI has to notice the wild card and the logic will happen there and calling different function in Round
      case Type.Numbered:
      case Type.Dummy:
        return;
    }
  }

  setWildColor(color:Colors) : void{
    this.discardPile.addCard(CreateSpecialColoredCard(Type.Dummy, color))
  }

  createMementoFromRound():RoundMemento{
    let playerMementos: PlayerMemento[] = [];
    for (let player of this.players){
      playerMementos.push(player.createMementoFromPlayer())
    }
    return new RoundMemento(playerMementos,this.drawPile.createMementoFromDeck(),this.discardPile.createMementoFromDeck(),this.currentPlayer,this.currentDirection,this.statusMessage,this.topCard,this.getWinner())
  }
}
