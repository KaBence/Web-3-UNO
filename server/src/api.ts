import { MemoryStore } from "../src/memoryStore"
import { GameStore, ServerModel } from "./serverModel"
import { Game } from "../../Domain/src/model/Game"
import { ApiResponse } from "../src/response"
import { GameMemento } from "Domain/src/model/GameMemento"

export interface Broadcaster {
  send: (message: Game) => Promise<void>
}

export class GameAPI {
  private server: ServerModel
  private broadcaster:Broadcaster

  constructor(broadcaster: Broadcaster,store:GameStore){
    this.server = new ServerModel(store)
    this.broadcaster = broadcaster
  }

  async getPendingGames(): Promise<Game[]> {
    return this.server.all_pending_games();
  }

  async getActiveGames(): Promise<Game[]> {
    throw new Error("Method not implemented.");
  }

  /** Add a player to a pending game */
  async addPlayer(gameId: string, playerName: string): Promise<Game> {
    // const pending = this.pendingGames.get(gameId);
    // if (!pending) throw new Error(`No pending game with id: ${gameId}`);

    // // Prevent duplicates
    // if (pending.players.find((p) => p.name === playerName))
    //   throw new Error("Player already in game");

    // const newPlayer: Player = { name: playerName, hand: { cards: [] } };
    // pending.players.push(newPlayer);
    // pending.scores.push({ player: playerName, score: 0 });

    // return pending;
    throw new Error("Method not implemented.");
  }

  /** Remove a player from a pending game */
  async removePlayer(gameId: string, playerName: string): Promise<Game> {
    // const pending = this.pendingGames.get(gameId);
    // if (!pending) throw new Error(`No pending game with id: ${gameId}`);

    // pending.players = pending.players.filter((p) => p.name !== playerName);
    // pending.scores = pending.scores.filter((s) => s.player !== playerName);

    // return pending;
    throw new Error("Method not implemented.");
  }

  /** Start the first round and activate the game */
  async startRound(gameId: string): Promise<Game> {
    throw new Error("Method not implemented.");
    // const pending = this.pendingGames.get(gameId);
    // if (!pending) throw new Error(`Cannot start: no pending game with id ${gameId}`);
    // if (pending.players.length < 2)
    //   throw new Error("Need at least 2 players to start a game");

    // const round: Round = {
    //   players: pending.players,
    //   drawdeck: this.generateDeck(),
    //   topCard: this.drawRandomCard(),
    //   direction: "CLOCKWISE",
    //   currentPlayer: pending.players[0].name,
    //   statusMessage: "Game started!",
    // };

    // const active: ActiveGame = {
    //   id: pending.id,
    //   currentRound: round,
    //   players: pending.players,
    //   scores: pending.scores,
    //   dealer: pending.dealer,
    // };

    // this.activeGames.set(gameId, active);
    // this.pendingGames.delete(gameId);
    // return active;
  }

  /** Handle playing a card */
  async playCard(gameId: string, cardId: number, chosenColor?: string): Promise<Game> {
    throw new Error("Method not implemented.");
    // const active = this.activeGames.get(gameId);
    // if (!active) throw new Error("Game not active");

    // const round = active.currentRound;
    // const currentPlayer = round.players.find(
    //   (p) => p.name === round.currentPlayer
    // );
    // if (!currentPlayer || !currentPlayer.hand)
    //   throw new Error("Invalid player hand");

    // const playedCard = currentPlayer.hand.cards.splice(cardId, 1)[0];
    // round.topCard = { ...playedCard, color: chosenColor ?? playedCard.color };
    // round.statusMessage = `${currentPlayer.name} played a ${round.topCard.type}`;

    // // Move to next player
    // const currentIndex = round.players.findIndex((p) => p.name === currentPlayer.name);
    // const nextIndex =
    //   round.direction === "CLOCKWISE"
    //     ? (currentIndex + 1) % round.players.length
    //     : (currentIndex - 1 + round.players.length) % round.players.length;
    // round.currentPlayer = round.players[nextIndex].name;

    // return active;
  }

  /** Draw a card */
  async drawCard(gameId: string): Promise<Game> {
    // const active = this.activeGames.get(gameId);
    // if (!active) throw new Error("Game not active");

    // const round = active.currentRound;
    // const currentPlayer = round.players.find(
    //   (p) => p.name === round.currentPlayer
    // );
    // if (!currentPlayer || !currentPlayer.hand)
    //   throw new Error("Invalid player hand");

    // const newCard = this.drawRandomCard();
    // currentPlayer.hand.cards.push(newCard);
    // round.statusMessage = `${currentPlayer.name} drew a card`;

    // return active;
    throw new Error("Method not implemented.");
  }

  /** Simple UNO call */
  async unoCall(gameId: string, playerId: string): Promise<Game> {
    // const active = this.activeGames.get(gameId);
    // if (!active) throw new Error("Game not active");

    // const player = active.players.find((p) => p.name === playerId);
    // if (player) player.unoCalled = true;
    // active.currentRound.statusMessage = `${playerId} called UNO!`;

    // return active;
    throw new Error("Method not implemented.");
  }

  async accuseUno(gameId: string, accuser: string, accused: string): Promise<Game> {
    // const active = this.activeGames.get(gameId);
    // if (!active) throw new Error("Game not active");

    // active.currentRound.statusMessage = `${accuser} accused ${accused} of missing UNO!`;
    // return active;
    throw new Error("Method not implemented.");
  }

  async challengeDraw4(gameId: string): Promise<Game> {
    // const active = this.activeGames.get(gameId);
    // if (!active) throw new Error("Game not active");

    // active.currentRound.statusMessage = `Challenge Draw 4 initiated!`;
    // return active;
    throw new Error("Method not implemented.");
  }

  async broadcast(game: Game): Promise<void> {
    this.broadcaster.send(game)
  }

  

  async createGame() {
    try {
      // 2️⃣ Persist the snapshot
      const game = await this.server.createGame()
      let g = new Game(game.getId())
      g.createGameFromMemento(game)
      this.broadcast(g)
      // 3️⃣ Return a clean API response
      return game
      // return JSON.parse(JSON.stringify(game));
      // return ApiResponse.ok(game, "Game created successfully")
    } 
    catch (error: any) {
      throw new Error(error.message); // GraphQL can handle errors directly
    }
  }
}