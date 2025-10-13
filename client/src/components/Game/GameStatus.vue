<script setup lang="ts">
import { ref, computed , onMounted, watch} from 'vue';
import { useActiveGameStore } from "@/Stores/OngoingGameStore";
import * as api from "@/model/api";
import { useRouter } from "vue-router";


const props = defineProps<{ gameId: number }>();
const ongoingGameStore = useActiveGameStore();
const game = ongoingGameStore.getGame(props.gameId);

const players = ref<{ name: string; score: number }[]>([]);
const rounds = ref<{ winner: string; points: number }[]>([]);
const roundgoing = ref(true);
const gameWinner = computed(() => game.value?.winner ?? null);

const router = useRouter();

const winner = computed(() => game.value?.currentRound?.winner ?? null);
const roundEnded = computed(() => !!winner.value); // double bang to convert to boolean
const gameWinnerName = computed(() => {
  const winnerId = gameWinner.value;
  if (!winnerId) return null;

  // Find the actual player's display name
  const playerName = game.value?.players.find(
    (p) => String(p.playername) === winnerId

  )?.name;

  return playerName ?? String(winnerId);
});

const sortedPlayers = computed(() =>
    [...players.value].sort((a, b) => b.score - a.score)
);


// Timer logic
const timer = ref(20); // Start with 10 seconds
const isCritical = ref(false); // Tracks if the timer is in the critical state

function startTimer() {
    const interval = setInterval(() => {
        timer.value--;
        if (timer.value <= 8) {
            isCritical.value = true; // Change to critical state after 5 seconds
        }
        if (timer.value <= 0) {
            clearInterval(interval); // Stop the timer when it reaches 0
        }
    }, 1000); // Decrease timer every second
}

watch(winner, (newWinner, oldWinner) => {
  if (!newWinner || newWinner === oldWinner) return;

  //  Resolve human-readable player name
  const playerName = String(
    game.value?.currentRound?.players.find(
      (p) => p.playername === newWinner
    )?.name ?? newWinner
  );

  //  Safely extract numeric score (handles objects / strings)
  const rawPoints = game.value?.scores?.[newWinner];
  const points =
    typeof rawPoints === "number"
      ? rawPoints
      : typeof rawPoints === "object" && "valueOf" in rawPoints
      ? rawPoints.valueOf()
      : Number(rawPoints) || 0;

  // Prevent duplicates (in case of repeated broadcasts)
  const alreadyLogged = rounds.value.some(
    (r) => r.winner === playerName && r.points === points
  );
  if (!alreadyLogged) {
    rounds.value.push({ winner: playerName, points });
  }

  //  Update scoreboard safely
  let player = players.value.find((p) => p.name === playerName);
  if (!player) {
    players.value.push({ name: playerName, score: points });
  } else {
    player.score = Number(player.score) + Number(points);
  }

  //  Mark round as finished
  roundgoing.value = false;

  console.log(`🏆 Round ended! Winner: ${playerName}, +${points} points`);
});

// do we want to do it manually or automatically?

async function playAgain() {
  if (!game.value) return;
  try {
    console.log("Starting new round...");

    await api.startRound(game.value.id);

    roundgoing.value = true;
    startTimer();
  } catch (err) {
    console.error("Failed to start new round:", err);
  }
}


async function playAgainAfterGame() {
  if (!game.value) return;
  try {
    await api.deleteGame(game.value.id);   // add this mutation in api.ts if you don’t have it yet
    router.push("/lobby");
  } catch (err) {
    console.error("Failed to delete game:", err);
  }
}

onMounted(() => {
    startTimer(); // Start the timer when the component is mounted
});





</script>

<template>
    <div class="gamestatus">
        <div class="timer" :class="{ critical: isCritical }">
            Time Left: {{ timer }}s
        </div>
        <div class="empty"></div>
       <!-- ROUND HISTORY -->
        <div class="Rounds">
          <h1>Round History</h1>
          <div class="round-List">
            <div
              v-for="(round, index) in rounds"
              :key="index"
              class="player"
              :class="{ current: index === rounds.length - 1 && roundgoing }"
            >
              <span class="rank">
                Round {{ index + 1 }}
                <span v-if="index === rounds.length - 1 && roundgoing"> (Current)</span>:
              </span>
              <span class="name">{{ round.winner }}</span>
              <span class="score">{{ round.points }} Points</span>
            </div>
          </div>
        </div>

        <div class="empty"></div>
        <h1>Scoreboard</h1>
        <div class="player-list">
            <div v-for="(player, index) in sortedPlayers" :key="index" class="player">
                <span class="rank">{{ index + 1 }}</span>
                <span class="name">{{ player.name }}</span>
                <span class="score">{{ player.score }}</span>
            </div>
        </div>
          <!-- WINNER DISPLAY -->
    <div v-if="roundEnded" class="winner-banner">
      🏆  Round Winner: {{ winner }} 🏆
    </div>
      <button
          class="play-again"
          @click="playAgain"
          :disabled="!roundEnded">
          Start new Round
      </button>
      <button
        v-if="gameWinner"
        class="play-again-final"
        @click="playAgainAfterGame"> {{ gameWinnerName }} won! Play Again
      </button>

    </div>
</template>

<style scoped>
.gamestatus {
    display: block;
    justify-content: center;
    flex-direction: column;
    background-color: #1e1e2f;
    color: white;
    padding: 20px;
    border-radius: 10px;
    width: 40vh;
    height: 95vh;
    float: right;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.empty{
    height: 12vh;
}

h1 {
    font-size: 24px;
    margin-bottom: 20px;
}

.player-list {
    margin-bottom: 20px;
}

.player {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #2e2e3f;
    border-radius: 5px;
    margin-bottom: 10px;
}
.player.current {
  background-color: #4caf50; /* Green highlight */
  color: white;
  font-weight: bold;
  border: 2px solid #81c784; /* Softer green border */
  transform: scale(1.02);
  transition: all 0.2s ease-in-out;
}

.rank {
    font-weight: bold;
}

.name {
    flex: 1;
    text-align: left;
    margin-left: 10px;
}

.score {
    font-weight: bold;
}

.play-again {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.play-again:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-again:hover:enabled {
  background-color: #0056b3;
}

.timer {
    font-size: 20px;
    font-weight: bold;
    color: white;
    background-color: #007bff;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
    transition: all 0.3s ease;
}

.timer.critical {
    background-color: red;
    animation: pulsate 1s infinite;
}

@keyframes pulsate {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
.winner-banner {
  margin-top: 10px;
  padding: 10px;
  border: 2px solid gold;
  border-radius: 8px;
  background-color: #333;
  color: gold;
  font-weight: bold;
}
</style>