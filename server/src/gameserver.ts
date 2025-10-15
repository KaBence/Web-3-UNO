import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { promises as fs } from "fs";
import { WebSocketServer } from "ws";
import cors from "cors";

import { GameStore } from "./serverModel";
import { standardRandomizer } from "domain/src/utils/random_utils";
import { MemoryStore } from "./memoryStore";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/use/ws";
import { PubSub } from "graphql-subscriptions";
import { GameAPI } from "./api";
import { Resolvers } from "./resolvers";
import { GameMemento } from "Domain/src/model/GameMemento";
import { Game } from "Domain/src/model/Game";

async function startServer(store: GameStore) {
  const pubsub: PubSub = new PubSub();


  // NEW and IMPROVED broadcaster

  const PENDING_GAMES_FEED = "pendingGamesFeed";
  const ACTIVE_GAMES_FEED = "activeGamesFeed";

  const broadcaster = {
    // Call this when a new game is created
    gameAdded(game: Game) {
      const topic = game.getCurrentRound() ? ACTIVE_GAMES_FEED : PENDING_GAMES_FEED;
      pubsub.publish(topic, {
        [topic]: {
          action: 'ADDED',
          gameId: game.getId(),
          game: game
        }
      });
    },

    // Call this when a game state changes (e.g., a player plays a card)
    gameUpdated(game: Game) {
      const topic = game.getCurrentRound() ? ACTIVE_GAMES_FEED : PENDING_GAMES_FEED;
      pubsub.publish(topic, {
        [topic]: {
          action: 'UPDATED',
          gameId: game.getId(),
          game: game
        }
      });
    },

    // Call this when a game is deleted or moves from one list to another
    gameRemoved(gameId: number, from: 'pending' | 'active') {
      const topic = from === 'pending' ? PENDING_GAMES_FEED : ACTIVE_GAMES_FEED;
      pubsub.publish(topic, {
        [topic]: {
          action: 'REMOVED',
          gameId: gameId,
          game: null // The game object is null, as required
        }
      });
    }
  };
  const api = new GameAPI(broadcaster, store);

  try {
    const content = await fs.readFile("./UNO.sdl", "utf8");
    const typeDefs = `#graphql
        ${content}`;
    const resolvers = new Resolvers(pubsub, api);
    const resolverMap = resolvers.getResolverMap();
    const app = express();
    app.use("/graphql", bodyParser.json());

    app.use(
      cors({
        origin: /:\/\/localhost:/,
        methods: ["GET", "POST", "OPTIONS"],
      })
    );
    app.use("/graphql", (_, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      next();
    });

    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers: resolverMap });

    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/graphql",
    });

    const subscriptionServer = useServer({ schema }, wsServer);

    const server = new ApolloServer({
      schema,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              drainServer: async () => subscriptionServer.dispose(),
            };
          },
        },
      ],
    });
    await server.start();
    app.use("/graphql", expressMiddleware(server));

    httpServer.listen({ port: 1337 }, () =>
      console.log(`GraphQL server ready on http://localhost:1337/graphql`)
    );
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

function configAndStart() {
  startServer(new MemoryStore);
}

configAndStart();
