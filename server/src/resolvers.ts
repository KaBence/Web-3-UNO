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
      return this.api.getActiveGames();
    },
    pendingGames: async () => {
      return this.api.getPendingGames();
    },
  };

  Mutation = {
    createGame: async () => {
      return this.api.createGame();
    },
    addPlayer: async (
      _: any,
      { gameId, playerName }: { gameId: string; playerName: string }
    ) => {
      return this.api.addPlayer(gameId, playerName);
    },
    removePlayer: async (
      _: any,
      { gameId, playerName }: { gameId: string; playerName: string }
    ) => {
      return this.api.removePlayer(gameId, playerName);
    },
    startRound: async (_: any, { gameId }: { gameId: string }) => {
      return this.api.startRound(gameId);
    },
    playCard: async (
      _: any,
      { gameId, cardId, chosenColor }: { gameId: string; cardId: number; chosenColor: string }
    ) => {
      return this.api.playCard(gameId, cardId, chosenColor);
    },
    drawCard: async (_: any, { gameId }: { gameId: string }) => {
      return this.api.drawCard(gameId);
    },
    unoCall: async (_: any, { gameId, playerId }: { gameId: string; playerId: string }) => {
      return this.api.unoCall(gameId, playerId);
    },
    accuseUno: async (
      _: any,
      { gameId, accuser, accused }: { gameId: string; accuser: string; accused: string }
    ) => {
      return this.api.accuseUno(gameId, accuser, accused);
    },
    challengeDraw4: async (_: any, { gameId }: { gameId: string }) => {
      return this.api.challengeDraw4(gameId);
    },
  };
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
      Mutation: this.Mutation
    };
  }
}
