  <template>
    <div class="lobby-wrapper">
      <div class="card">
        <!-- Top bar: who you are -->
        <div class="topbar">
          <div class="avatar small">{{ nameFirstLetter }}</div>
          <div class="who">
            <div class="label">You are {{ playerName }}</div>
            <div class="status">Online</div>
          </div>
        </div>


        <div class="grid">
          <!-- Profile block -->
          <aside class="profile">
            <div class="avatar large">{{ nameFirstLetter }}</div>
            <div class="name">{{ playerName }}</div>
            <div class="status pill">Online</div>
          </aside>

          <!-- Games list -->
          <section class="games">
            <h3><b>Games</b></h3>
            <ul class="game-list">
              <li class="game-item" v-for="g in visibleGames" :key="g.id">
                <div class="meta">
                  <div class="title">Game {{ g.id }}</div>
                 <div class="sub">
                    <span v-if="g.players.length === 0">No players yet</span>
                    <template v-else>
                      <span class="player-chip" v-for="p in g.players" :key="p">{{ p }}</span>
                    </template>
                  </div>
                </div>
                <div class="buttons-holder">
                  <button class="btn-join" type="button" @click="joinGame(g.id)"
                    v-if="hasJoinedGame.joinedGameId == null">Join</button>
                  <button class="btn-leave" type="button" v-else-if="hasJoinedGame.joinedGameId == g.id"
                    @click="leaveGame(g.id)">Leave</button>
                  <button class="btn-start-game" type="button" v-if="hasJoinedGame.joinedGameId == g.id"
                    @click="StartGame(g.id)">Start Game</button>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <div class="actions">
          <button class="btn-create" type="button" @click="createGame" v-if="hasCreatedGame == false">Create New
            Game</button>
          <div v-else>
            <p class="text-players-in-lobby" style="margin-right: 12px;">Players 0/4</p>// Placeholder, add real player
            count when implementing multiplayer
            <button class="btn-create" type="button" @click="hasCreatedGame = false">Close Game</button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script lang="ts" setup>
  import { ref, computed } from "vue"; // For game status Used to create reactive values that automatically update when their dependencies change.
  import { useRoute, useRouter } from "vue-router";
  import { usePlayerStore } from "@/Stores/PlayerStore";
 import * as api from '../model/api'

  const playerStore = usePlayerStore();
  const router = useRouter();
  const playerName = playerStore.player ? playerStore.player : "Player";
  let nameFirstLetter = playerName.split("")[0];

  // Create New Game Logic - no server yet.
  type GameStatus = "open" | "inProgress"; //Game status types created for the feature of not being able to join started game there is no "finished" cos the game shall disappear from the list when finished
  type Game = { id: number; players: string[]; status: GameStatus}; 

  const getGames = (): Game[] => {
    return [
    ];
  };

  const games = ref<Game[]>(getGames());
  const visibleGames = computed<Game[]>(() => games.value.filter(g => g.status === "open")); //filter out games that are not open
  const hasJoinedGame = ref({ joinedGameId: null as number | null });
  const hasCreatedGame = ref(false);

  //Join game logic
  const joinGame = (id: number) => {
    if (hasJoinedGame.value.joinedGameId === id) {
      hasJoinedGame.value.joinedGameId = null;
      return;
    } else if (hasJoinedGame.value.joinedGameId) {
      window.alert("Already in a game. Leave current game first.");
      console.log("Already in a game. Leave current game first.");
      return;
    } else if (hasCreatedGame.value === true) {
      window.alert("You created a game. Leave it first.");
      console.log("You created a game. Leave it first.");
      return;
    }

    console.log("Joining game", id);
    hasJoinedGame.value.joinedGameId = id;
  }

  const leaveGame = (id: number) => {
    console.log("Leaving game", id);
    hasJoinedGame.value.joinedGameId = null;
  }

  const createGame = async () => {

    await api.createGame()
    console.log("Creating a new game");
    // Implement start game logic here

    hasCreatedGame.value = true
  }

  const StartGame = (id: number) => {
    // marking as in progress so it disappears from visibleGames
    const g = games.value.find(x => x.id === id);
    if(g) g.status = "inProgress";
    router.push({ path: "/Game", query: { id } });
  }
  </script>

  <style scoped>
  .lobby-wrapper {
    min-height: 100dvh;
    display: grid;
    place-items: center;
    background: #f3f4f6;
    /* light gray */
    padding: 24px;
  }

  .card {
    /* fill available height and layout vertically */
    width: 740px;
    max-width: calc(100vw - 40px);
    height: 100%;                /* key: take all of wrapper's height */
    max-height: calc(100dvh - 48px); /* avoid overflow past wrapper padding */
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;            /* keep internal scrolling tidy */
  }

  .topbar {
    flex: 0 0 auto; 
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .avatar {
    display: grid;
    place-items: center;
    border-radius: 9999px;
    background: #34a853;
    /* UNO green */
    color: white;
    font-weight: 800;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  }

  .avatar.small {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .avatar.large {
    width: 96px;
    height: 96px;
    font-size: 42px;
    margin-bottom: 8px;
  }

  .who .label {
    font-weight: 700;
    color: #111827;
  }

  .status {
    color: #10b981;
    font-size: 12px;
  }

  .status.pill {
    background: #ecfdf5;
    color: #10b981;
    padding: 4px 10px;
    border-radius: 999px;
    display: inline-block;
  }

  .grid {
    /* the central area that should expand and allow inner scrolling */
    flex: 1 1 auto;              /* fill remaining space */
    min-height: 0;               /* IMPORTANT: allow children to overflow/scroll */
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px;
    margin-top: 8px;
  }

.profile {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;

  display: flex;              
  flex-direction: column;     
  align-items: center;        
  justify-content: flex-start;
  text-align: center;
  overflow: hidden;
}

  .profile .name {
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 6px;
  }

  .games {
    /* make section a column so header stays above the scroller */
    display: flex;
    flex-direction: column;
    min-height: 0;               /* allow the UL to become scrollable */
  }

  .games h3 {
    margin: 6px 0 10px;
    color: #111827;
    flex: 0 0 auto;
  }

  .game-list {
    /* the scroller */
    flex: 1 1 auto;
    min-height: 0;               /* enables flex children to actually shrink */
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 4px;          /* tiny breathing room from scrollbar */
    -webkit-overflow-scrolling: touch;
  }

  .game-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 10px 12px;
  }

  .meta .title {
    font-weight: 700;
    color: #1f2937;
  }

  .meta .sub {
    font-size: 12px;
    color: #6b7280;
  }
  
  .sub .player-chip {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f3f4f6;
  margin-right: 6px;   /* this creates space between player names */
  font-size: 12px;
  color: #374151;
}

  .btn-join {
    background: #1f6feb;
    /* UNO blue tone */
    color: #fff;
    border: none;
    padding: 8px 14px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-join:hover {
    filter: brightness(1.03);
  }

  .actions {
    flex: 0 0 auto;              /* pinned at the bottom of the card */
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .btn-create {
    background: #1f6feb;
    /* primary */
    color: #fff;
    border: none;
    padding: 12px 18px;
    border-radius: 12px;
    font-weight: 800;
    cursor: pointer;
    min-width: 240px;
    box-shadow: 0 6px 14px rgba(31, 111, 235, 0.35);
  }

  .btn-create:hover {
    filter: brightness(1.03);
  }

  .text-players-in-lobby {
    color: black;
  }

  .btn-join,
  .btn-leave,
  .btn-start-game {
    background: #1f6feb;
    /* same as Join */
    color: #fff;
    border: none;
    padding: 8px 14px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 14px rgba(31, 111, 235, 0.35);
    transition: filter 0.2s, transform 0.1s;
  }

  .btn-join:hover,
  .btn-leave:hover,
  .btn-start-game:hover {
    filter: brightness(1.03);
  }

  .btn-join:active,
  .btn-leave:active,
  .btn-start-game:active {
    transform: translateY(1px);
  }

  /* Responsive */
  @media (max-width: 700px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
