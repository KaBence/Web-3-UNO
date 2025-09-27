import { DrawDeck, DiscardDeck, Deck } from "./Deck";
import { Hand } from "./Hand";
import { Player, PlayerNames } from "./Player";
import { Card, Type, Colors, SpecialColoredCard } from "./Card";
import * as randomUtils from "../utils/random_utils";

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
  private cardsPerPlayer: number;

  constructor(players: Player[], dealer: number, cardsPerPlayer: number) {
    this.drawPile = new DrawDeck();
    this.discardPile = new DiscardDeck([this.drawPile.deal()!]);
    this.players = players;
    this.currentDirection = Direction.Clockwise;
    this.currentPlayer = (dealer + 1) % this.players.length; //should be next player after dealer
    this.cardsPerPlayer = cardsPerPlayer;

    for (let i = 0; i < cardsPerPlayer; i++) {
        for (const player of this.players) {
            player.getHand().addCard(this.drawPile.deal()!);
        }
    }
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
    const specificPlayer = this.players.find((p) => p.getID === player.valueOf);
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

  changeCurrentDirection(): void {
    this.currentDirection =
      this.currentDirection === Direction.Clockwise
        ? Direction.CounterClockwise
        : Direction.Clockwise;
  }

  getCardsPerPlayer(): number {
    return this.cardsPerPlayer;
  }

  getPlayerHand(player: PlayerNames): Hand {
    return this.players.find((p) => p.getID === player.valueOf)?.getHand()!;
  }

  //Game logic methods

  currentCard(): Card {
    return this.discardPile.peek();
  }

  roundHasEnded(): boolean {
    return this.players.some((p) => p.getHand().size() === 0);
  }

  //should it be called every time a move has been ma
  winner(): Player | undefined {
    const winner = this.players.find((p) => p.getHand().size() === 0);
    return winner;
  }

  //catchUnoFailuere)() this is responsible for a situation when an accuser player says that the accused has not said uno. if that is true so if the accussed has one card the accussed has to draw 4 cards if the accuser was wrong then they have to draw 6 cards from the draw deck

  catchUnoFailure(accuser: PlayerNames, accused: PlayerNames): void {
    if (!this.getCurrentPlayer().hasUno()) {
      this.draw(4, accused);
    } else {
      // Accuser is wrong → accuser draws 6
      this.draw(6, accuser);
    }
  }

  //also takes an optional color enum for wildcards
  play(card: Card, automaticDraw: boolean, colour?: Colors): void {
    if (!this.canPlay(card)) {
      if (automaticDraw) {
        this.draw(1, this.getCurrentPlayer().getID());
      }
    } else {
      this.getCurrentPlayer().getHand().removeCard(card);
      this.discardPile.addCard(card);

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
        case Type.WildDrawFour:
          // TODO: we don't do anything here because hte GUI will call challengeWildDrawFour if the players wants or after 5 seconds no matter what
          break;
        case Type.Wild:
          this.discardPile.addCard(new SpecialColoredCard(Type.Dummy, colour!));
          break;
        case Type.Numbered:
          //we don't do anything because it is covered above the switch
          break;
        default:
          throw "Unexpected move not coverd by the logic";
      }
    }
    this.currentPlayer = this.getNextPlayer();
  }
  //bb

  draw(noCards: number, playedId: PlayerNames): void {
    for (let i = 0; i < noCards; i++) {
      let card = this.drawPile.deal();
      if (card == undefined) {
        let [topCard, ...rest] = this.discardPile.getCards();

        this.discardPile = new DiscardDeck([topCard]);
        let filtered = rest.filter((c) => c.getType() !== Type.Dummy);
        this.drawPile = new DrawDeck(filtered);
        this.drawPile.shuffle(randomUtils.standardShuffler);
        card = this.drawPile.deal();
      }
      if (this.getSpecificPlayer(playedId).hasUno()) {
        this.getSpecificPlayer(playedId).setUno(false);
      }
      this.getPlayerHand(playedId).addCard(card!);
      if (noCards === 1) {
        this.play(card!, false);
      }
    }
  }

  //if you forget to say uno and it is already the next person's round, you should still be able to call UNO
  sayUno(player: PlayerNames): void {
    const specificPlayer = this.getSpecificPlayer(player);
    const hand = specificPlayer.getHand();
    if (hand.size() === 2) {
      if (
        this.canPlay(hand.getCards()[0]) ||
        this.canPlay(hand.getCards()[1])
      ) {
        specificPlayer.setUno(true);
        return;
      }
      this.draw(4, player);
      return;
    }
    if (specificPlayer.getHand().size() != 1) {
      this.draw(4, player);
      return;
    }
    specificPlayer.setUno(true);
  }

  canPlay(card: Card): boolean {
    switch (card.getType()) {
      case Type.Skip || Type.Reverse || Type.Draw:
        if (this.currentCard()!.getType() === card.getType() || this.currentCard()!.getColor() === card.getColor()) {
          return true;
        }
        return false;

      case Type.Wild || Type.WildDrawFour:
        return true;

      case Type.Numbered:
        if (this.currentCard()!.getType() === card.getType() || this.currentCard()!.getColor() === card.getColor()){
            return true;
        }
        return false;
      default:
        throw "Unexpected move not coverd by the logic";
    }
  }

  // currently the logic is not logicing because by the time this is called the next player is called at the end of PLAY()
  challengeWildDrawFour(isChallenged: boolean): void {
    if (!isChallenged) {
      this.draw(4, this.getNextPlayer());
      this.currentPlayer = this.getNextPlayer();
      return;
    }
    if (this.couldPlayInsteadofDrawFour()) {
      this.draw(6, this.getNextPlayer());
      this.currentPlayer = this.getNextPlayer();
    } else {
      this.draw(4, this.currentPlayer);
    }
  }

  //Helper functions

  getNextPlayer(): PlayerNames {
    let index = 0;
    if (this.getCurrentDirection() === Direction.Clockwise) {
      index =
        (this.players.findIndex((p) => p.getID === this.currentPlayer.valueOf) +
          1) %
        this.players.length;
    } else {
      index =
        (this.players.findIndex((p) => p.getID === this.currentPlayer.valueOf) -
          1) %
        this.players.length;
    }

    return this.players[index].getID();
  }

  couldPlayInsteadofDrawFour(): boolean {
    const hand = this.getPlayerHand(this.getNextPlayer()).getCards();

    for (let i = 0; i < hand.length; i++) {
      if (hand[i].getType() !== Type.Wild || hand[i].getType() !== Type.WildDrawFour) {
        if (this.currentCard()!.getColor() === hand[i].getColor()){
                return true;
        }
      }
    }
    return false;
  }
}
