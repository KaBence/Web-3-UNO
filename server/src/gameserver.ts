import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

import express from 'express';
import bodyParser from 'body-parser'
import http from 'http';
import {promises as fs} from "fs"
import { WebSocketServer } from 'ws'
import cors from 'cors'

import { GameStore  } from './serverModel'
import { standardRandomizer } from 'domain/src/utils/random_utils'
import { MemoryStore } from './memoryStore'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { useServer } from 'graphql-ws/use/ws'
import { PubSub } from 'graphql-subscriptions'
import { GameAPI } from './api';
import { Resolvers } from './resolvers'
import { GameMemento } from 'Domain/src/model/GameMemento';


async function startServer(store: GameStore) {
  const pubsub: PubSub = new PubSub()
  // const broadcaster = {
  //   async send(game: GameMemento) {
  //     if (game.getCurrentRound()==undefined) {
  //       pubsub.publish('PENDING_UPDATED', {pending: toGraphQLGame(game)})
  //     } else {
  //       pubsub.publish('ACTIVE_UPDATED', {active: toGraphQLGame(game)})
  //     }
  //   }
  // }
  const api = new GameAPI(store)

  try {
      const content = await fs.readFile('./UNO.sdl', 'utf8')
      const typeDefs = `#graphql
        ${content}`
      const resolvers = new Resolvers(pubsub, api)
      const resolverMap = resolvers.getResolverMap();
      const app = express()
      app.use('/graphql', bodyParser.json())

      app.use(cors())
      app.use('/graphql', (_, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        next();
      })
      
      const httpServer = http.createServer(app)

      const schema = makeExecutableSchema({typeDefs, resolvers: resolverMap})

      const wsServer = new WebSocketServer({
        server: httpServer
      })

      const subscriptionServer = useServer({ schema }, wsServer)

      const server = new ApolloServer({
        schema,
        plugins: [
          ApolloServerPluginDrainHttpServer({ httpServer }),
          {
            async serverWillStart() {
              return {
                drainServer: async () => subscriptionServer.dispose()
              }
            }
          }
        ],
      })
      await server.start()
      app.use('/graphql', expressMiddleware(server))
      
      httpServer.listen({ port: 1337 }, () => console.log(`GraphQL server ready on http://localhost:1337/graphql`))
  } catch (err) {
      console.error(`Error: ${err}`)
  }
}

function configAndStart() {
  startServer(new MemoryStore())
}

configAndStart()