import { PubSub } from "graphql-subscriptions";
import { GameAPI } from "./api";

export class Resolvers {
  private pubsub: PubSub;
  private api: GameAPI;
  constructor(pubsub: PubSub, api: GameAPI) {
    this.pubsub = pubsub;
    this.api = api;
  }

  Query = {
    activeGames: async () => {
      return await this.api.getActiveGames();
    },
    pendingGames: async () => {
      return await this.api.getPendingGames();
    },
  };

  Mutation = {
    createGame: async () => {
      return await this.api.createGame();
    },
    addPlayer: async (
      _: any,
      { gameId, playerName }: { gameId: number; playerName: string }
    ) => {
      return this.api.addPlayer(gameId, playerName);
    },
    removePlayer: async (
      _: any,
      { gameId, playerId }: { gameId: number; playerId: number }
    ) => {
      return this.api.removePlayer(gameId, playerId);
    },
    startRound: async (_: any, { gameId }: { gameId: string }) => {
      return await this.api.startRound(parseInt(gameId));
    },
    playCard: async (
      _: any,
      { gameId, cardId, chosenColor }: { gameId: number; cardId: number; chosenColor: string }
    ) => {
      return this.api.playCard(gameId, cardId, chosenColor);
    },
    drawCard: async (_: any, { gameId }: { gameId: string }) => {
      return await this.api.drawCard(parseInt(gameId));
    },
    unoCall: async (_: any, { gameId, playerId }: { gameId: number; playerId: number }) => {
      return await this.api.unoCall(gameId, playerId);
    },
    accuseUno: async (
      _: any,
      { gameId, accuser, accused }: { gameId: number; accuser: number; accused: number }
    ) => {
      return this.api.accuseUno(gameId, accuser, accused);
    },
    challengeDraw4: async (_: any, { gameId }: { gameId: number }) => {
      return this.api.challengeDraw4(gameId);
    },
  };

  Subscription = {
    active: {
      subscribe: () => this.pubsub.asyncIterableIterator(['ACTIVE_UPDATED'])
    },
    pending: {
      subscribe: () => this.pubsub.asyncIterableIterator(['PENDING_UPDATED'])
    }
  }
  // public toGraphQLPendingGame(game:GameMemento):PendingGame{
  //     return {
  //         players:game.getPlayers()
  //         scores: game.getScores()
  //         dealer: game.getDealer()\
  //     }
  // }

  public getResolverMap() {
    return {
      Query: this.Query,
      Mutation: this.Mutation,
      Subscription: this.Subscription
    };
  }
}
