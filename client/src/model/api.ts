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
import type { GameSpecs } from "@/model/Specs";
import type { Colors } from "Domain/src/model/Card";

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
          drawDeckSize
        }
      }
    }
  `;
  try {
    const { data } = await apolloClient.mutate({ mutation, fetchPolicy: "network-only", });

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
          playerName
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
            playerName
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
          drawDeckSize
        }
      }
    }
  `;
  try {
    const { data } = await apolloClient.query({ query, fetchPolicy: "network-only", });

    return data.pendingGames;
  } catch (error: any) {
    console.error("Failed to get pending games:", error);
    throw error;
  }
}

export async function getActiveGames() {
  const query = gql`
    query PendingGames {
      activeGames {
        dealer
        id
        scores
        players {
          unoCalled
          name
          playerName
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
            playerName
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
          drawDeckSize
        }
      }
    }
  `;
  try {
    const { data } = await apolloClient.query({ query, fetchPolicy: "network-only", });

    return data.activeGames;
  } catch (error: any) {
    console.error("Failed to get active games:", error);
    throw error;
  }
}

export async function startRound(gameId: number) {
  const mutation = gql`
    mutation Mutation($gameId: Int!) {
      startRound(gameId: $gameId) {
        scores
        players {
          unoCalled
          playerName
          name
          hand {
            cards {
              color
              number
              type
            }
          }
        }
        id
        dealer
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
            playerName
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
          drawDeckSize
        }
      }
    }
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { gameId }, 
    fetchPolicy: "network-only",
  });

  return data.startRound;
}

export async function drawCard(gameId: number) {
  const mutation = gql`
  mutation Mutation($gameId: Int!) {
  drawCard(gameId: $gameId) {
    scores
    players {
      unoCalled
      playerName
      name
      hand {
        cards {
          color
          number
          type
        }
      }
    }
    id
    dealer
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
        playerName
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
      drawDeckSize
    }
  }
}`

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { gameId },
    fetchPolicy: "network-only",
  });

  return data.drawCard;
}

export async function sayUno(gameId: number, playerId: number) {
  const mutation = gql`
  mutation UnoCall($gameId: Int!, $playerId: Int!) {
  unoCall(gameId: $gameId, playerId: $playerId) {
    currentRound {
      currentDirection
      currentPlayer
      players {
        hand {
          cards {
            color
            number
            type
          }
        }
        name
        unoCalled
        playerName
      }
      winner
      topCard {
        type
        number
        color
      }
      statusMessage
    }
    scores
    players {
      unoCalled
      playerName
      name
      hand {
        cards {
          type
          number
          color
        }
      }
    }
    id
    dealer
  }
}
  `
  const { data } = await apolloClient.mutate({
    mutation,
    variables: { gameId, playerId },
    fetchPolicy: "network-only",
  });

  return data.unoCall;
}



export async function accuseUno(gameId: number, accuser: number, accused: number) {
  const mutation = gql`
 
mutation AccuseUno($gameId: Int!, $accuser: Int!, $accused: Int!) {
  accuseUno(gameId: $gameId, accuser: $accuser, accused: $accused) {
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
        playerName
        name
        hand {
          cards {
            type
            number
            color
          }
        }
      }
      currentPlayer
      currentDirection
    }
    dealer
    id
    players {
      unoCalled
      playerName
      name
      hand {
        cards {
          type
          number
          color
        }
      }
    }
    scores
  }
}`

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { gameId, accuser, accused },
    fetchPolicy: "network-only",


  });
  return data.accuseUno;
}

export async function onGame(subscriber: (game: GameSpecs) => any) {
  const gameSubscriptionQuery = gql`
    subscription Subscription {
  active {
    currentRound {
      currentDirection
      currentPlayer
      drawDeckSize
      players {
        hand {
          cards {
            color
            number
            type
          }
        }
        name
        playerName
        unoCalled
      }
      statusMessage
      topCard {
        type
        number
        color
      }
      winner
    }
    dealer
    id
    players {
      unoCalled
      playerName
      name
      hand {
        cards {
          color
          number
          type
        }
      }
    }
    scores
  }
}
  `;
  const gameObservable = apolloClient.subscribe({
    query: gameSubscriptionQuery,
    fetchPolicy: "network-only",
  });
  gameObservable.subscribe({
    next({ data }) {
      const game: GameSpecs = data.active;
      console.log("onGameSub happened")
      subscriber(game);
    },
    error(err) {
      console.error(err);
    },
  });
}

export async function onPending(subscriber: (game: GameSpecs) => any) {
  const gameSubscriptionQuery = gql`
    subscription Pending {
      pending {
        currentRound {
          currentDirection
          currentPlayer
          players {
            hand {
              cards {
                color
                number
                type
              }
            }
            name
            playerName
            unoCalled
          }
          statusMessage
          topCard {
            color
            number
            type
          }
          winner
          drawDeckSize
        }
        dealer
        id
        players {
          hand {
            cards {
              color
              number
              type
            }
          }
          name
          playerName
          unoCalled
        }
        scores
      }
    }
  `;
  const gameObservable = apolloClient.subscribe({
    query: gameSubscriptionQuery,
    fetchPolicy: "network-only",
  });
  gameObservable.subscribe({
    next({ data }) {
      const pending: GameSpecs = data.pending;
      subscriber(pending);
    },
    error(err) {
      console.error(err);
    },
  });
}

export async function play(gameId:number, cardId:number, chosenColor?:string) {
  console.log(chosenColor)
  const mutation = gql`
  mutation PlayCard($gameId: Int!, $cardId: Int!, $chosenColor: String) {
    playCard(gameId: $gameId, cardId: $cardId, chosenColor: $chosenColor) {
      scores
      players {
        unoCalled
        playerName
        name
        hand {
          cards {
            type
            number
            color
          }
        }
      }
      id
      dealer
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
          playerName
          name
          hand {
            cards {
              type
              number
              color
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
    const { data } = await apolloClient.mutate({ 
      mutation,
      variables: {gameId,cardId,chosenColor},
      fetchPolicy: "network-only",
    });

    // The union will return either PendingGame or ActiveGame
    const game = data.play;
    console.log(game)
    return game;
  } catch (error: any) {
    console.error("Failed to play:", error);
    throw error;
  }
}







export async function challengeDraw4(gameId:number) {
  const mutation = gql`
  mutation ChallengeDraw4($gameId: Int!) {
    challengeDraw4(gameId: $gameId) {
      id
    }
  }
  `;
  try {
    const { data } = await apolloClient.mutate({ 
      mutation,
      variables: {gameId},
      fetchPolicy: "network-only",
    });

    const game = data.play;
    console.log(game)
    return game;
  } catch (error: any) {
    console.error("Failed to execute challenge draw 4:", error);
    throw error;
  }
}

export async function joinGame(gameId: number, playerName: string) {
  const mutation = gql`
    mutation AddPlayer($gameId: Int!, $playerName: String!) {
    addPlayer(gameId: $gameId, playerName: $playerName) {
      currentRound {
        currentDirection
        currentPlayer
        players {
          name
          unoCalled
          hand {
            cards {
              type
              color
              number
            }
          }
          playerName
        }
        statusMessage
        topCard {
          type
          color
          number
        }
        winner
      }
      dealer
      id
      players {
        name
        unoCalled
        hand {
          cards {
            type
            color
            number
          }
        }
        playerName
      }
      scores
    }
  }
    `;

    const {data} = await apolloClient.mutate({
      mutation,
      variables: {gameId, playerName},
      fetchPolicy: "network-only",
    });
    return data.addPlayer;
  }
  
export async function leaveGame(gameId: number, playerId: number) {
  const mutation = gql`
      mutation Mutation($gameId: Int!, $playerId: Int!) {
      removePlayer(gameId: $gameId, playerId: $playerId) {
        currentRound {
          players {
            name
            unoCalled
            hand {
              cards {
                type
                color
                number
              }
            }
            playerName
          }
          drawDeckSize
          topCard {
            type
            color
            number
          }
          currentDirection
          winner
          currentPlayer
          statusMessage
        }
        players {
          name
          unoCalled
          hand {
            cards {
              type
              color
              number
            }
          }
          playerName
        }
        scores
        dealer
        id
      }
    }`;

    const {data} = await apolloClient.mutate({
      mutation,
      variables: {gameId, playerId},
      fetchPolicy: "network-only",
    });
    return data.removePlayer;
  }
 