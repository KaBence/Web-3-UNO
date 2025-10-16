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

import { usePendingGameStore } from "@/Stores/PendingGameStore";
import { useActiveGameStore } from "@/Stores/OngoingGameStore";

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
          playername
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
            playername
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
    winner
    
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
    query ActiveGames {
      activeGames {
        currentRound {
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
        winner
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
 mutation StartRound($gameId: Int!) {
  startRound(gameId: $gameId) {
    currentRound {
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
      players {
        name
        unoCalled
        playerName
        hand {
          cards {
            type
            color
            number
          }
        }
      }
    }
    players {
      name
      unoCalled
      playerName
      hand {
        cards {
          type
          color
          number
        }
      }
    }
    scores
    dealer
    id
    winner
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
    mutation DrawCard($gameId: Int!) {
      drawCard(gameId: $gameId) {
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
        winner
        
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
      players {
        name
        unoCalled
        playerName
        hand {
          cards {
            type
            color
            number
          }
        }
      }
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
    winner
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
        winner
      }
    }`

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { gameId, accuser, accused },
    fetchPolicy: "network-only",


  });
  return data.accuseUno;
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
      variables: { gameId, cardId, chosenColor },
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

export async function canPlay(gameId:number, cardId:number) {
  const mutation = gql`
  mutation CanPlay($gameId: Int!, $cardId: Int!) {
    canPlay(gameId: $gameId, cardId: $cardId)
  }
  `;
  try {
    const { data } = await apolloClient.mutate({ 
      mutation,
      variables: {gameId,cardId},
      fetchPolicy: "network-only",
    });

    // The union will return either PendingGame or ActiveGame
    const flag = data.canPlay;
    return flag;
  } catch (error: any) {
    console.error("Failed when checking if can play:", error);
    throw error;
  }
}

export async function challengeDraw4(gameId:number, response: boolean) { //get the challngeStatus from mutation - to be added
  const mutation = gql`
  mutation ChallengeDraw4($gameId: Int!, $response: Boolean!) {
    challengeDraw4(gameId: $gameId, response: $response)
  }
  `;
  try {
    const { data } = await apolloClient.mutate({ 
      mutation,
      variables: {gameId, response},
      fetchPolicy: "network-only",
    });
    const result = data.challengeDraw4;
    return result;
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
      players {
        name
        unoCalled
        playerName
        hand {
          cards {
            type
            color
            number
          }
        }
      }
    }
    players {
      name
      unoCalled
      playerName
      hand {
        cards {
          type
          color
          number
        }
      }
    }
    scores
    dealer
    id
    winner
  }
}
    `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { gameId, playerName },
    fetchPolicy: "network-only",
  });
  return data.addPlayer;
}

export async function removePlayer(gameId: number, playerId: number) {
  const mutation = gql`
  mutation RemovePlayer($gameId: Int!, $playerId: Int!) {
  removePlayer(gameId: $gameId, playerId: $playerId) {
    currentRound {
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
      players {
        name
        unoCalled
        playerName
        hand {
          cards {
            type
            color
            number
          }
        }
      }
    }
    players {
      name
      unoCalled
      playerName
      hand {
        cards {
          type
          color
          number
        }
      }
    }
    scores
    dealer
    id
    winner
  }
}`;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { gameId, playerId },
    fetchPolicy: "network-only",
  });
  return data.removePlayer;
}

const PENDING_GAMES_SUBSCRIPTION = gql`
 subscription PendingGamesFeed {
  pendingGamesFeed {
    action
    gameId
    game {
      __typename
      currentRound {
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
        players {
          __typename
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
      winner
    }
    
  }
}

 
`;

const ACTIVE_GAMES_SUBSCRIPTION = gql`
  subscription ActiveGamesFeed {
  activeGamesFeed {
    action
    game {
      currentRound {
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
      winner
    }
    gameId
  }
}
`;

export function initializeGameSubscriptions() {
  console.log("Initializing real-time game subscriptions...");

  // Get instances of your Pinia stores
  const pendingGameStore = usePendingGameStore();
  const activeGameStore = useActiveGameStore();

  // Subscribe to the PENDING games feed
  apolloClient.subscribe({ query: PENDING_GAMES_SUBSCRIPTION }).subscribe({
    next({ data }) {
      if (!data?.pendingGamesFeed) return;

      const { action, game, gameId } = data.pendingGamesFeed;

      switch (action) {
        case 'ADDED':
        case 'UPDATED':
          pendingGameStore.upsert(game);
          break;
        case 'REMOVED':
          pendingGameStore.remove({ id: gameId });
          break;
      }
    },
    error: (err) => console.error("Pending subscription error:", err),
  });

  // Subscribe to the ACTIVE games feed
  apolloClient.subscribe({ query: ACTIVE_GAMES_SUBSCRIPTION }).subscribe({
    next({ data }) {
      if (!data?.activeGamesFeed) return;

      const { action, game, gameId } = data.activeGamesFeed;

      switch (action) {
        case 'ADDED':
        case 'UPDATED':
          activeGameStore.upsert(game);
          break;
        case 'REMOVED':
          activeGameStore.remove({ id: gameId });
          break;
      }
    },
    error: (err) => console.error("Active subscription error:", err),
  });
}

