import {
  ApolloClient,
  gql,
  InMemoryCache,
  type DocumentNode,
  split,
  HttpLink,
} from "@apollo/client/core";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:1337/graphql",
  })
);

const httpLink = new HttpLink({
  uri: "http://localhost:1337/graphql",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

async function query(query: DocumentNode, variables?: Object): Promise<any> {
  const { data } = await apolloClient.query({
    query,
    variables,
    fetchPolicy: "network-only",
  });
  return data;
}

async function mutate(
  mutation: DocumentNode,
  variables?: Object
): Promise<any> {
  const { data } = await apolloClient.mutate({
    mutation,
    variables,
    fetchPolicy: "network-only",
  });
  return data;
}

export async function createGame() {
  const mutation = gql`
    mutation Mutation {
      createGame {
        scores
        id
        dealer
        players {
          unoCalled
          name
          hand {
            cards {
              color
              number
              type
            }
          }
        }
        currentRound {
          winner
          topCard {
            type
            number
            color
          }
          statusMessage
          players {
            unoCalled
            name
            hand {
              cards {
                color
                number
                type
              }
            }
          }
          currentPlayer
          currentDirection
        }
      }
    }
  `;
  try {
    const { data } = await apolloClient.mutate({ mutation });

    // The union will return either PendingGame or ActiveGame
    const game = data.createGame;
    return game;
  } catch (error: any) {
    console.error("Failed to create game:", error);
    throw error;
  }
}

export async function getPendingGames() {
  const query = gql`
    
query PendingGames {
  pendingGames {
    dealer
    id
    scores
    players {
      unoCalled
      name
      hand {
        cards {
          color
          number
          type
        }
      }
    }
    currentRound {
      winner
      topCard {
        type
        number
        color
      }
      statusMessage
      players {
        unoCalled
        name
        hand {
          cards {
            color
            number
            type
          }
        }
      }
      currentPlayer
      currentDirection
    }
  }
}
  `;
  try {
    const { data } = await apolloClient.query({ query });

    return data.pendingGames;
  } catch (error: any) {
    console.error("Failed to get pending games:", error);
    throw error;
  }
}
