<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import type { GameSpecs, HandSpecs } from "@/model/Specs";
import { usePopupStore } from "@/Stores/PopupStore";

const emit = defineEmits<{
  (e: "playAgain"): void;
  (e: "endGame"): void;
  (e: "timeUp"): void;
}>();

const props = defineProps<{
  game: GameSpecs | undefined;
  myPlayerId: number;
}>();

const route = useRoute();
const popupStore = usePopupStore();

// ------ Local UI state ------
const rounds = ref<{ winner: string; points: number }[]>([]);
const lastScores = ref<Record<number, number>>({});

const timer = ref(20);
const isCritical = ref(false);

const roundEnded = computed(() => !!props.game?.currentRound?.winner);
const roundgoing = computed(() => !roundEnded.value);
const gameWinnerId = computed(() => props.game?.winner ?? null);

const showPlayAgainAfterGame = computed(() => !!props.game?.winner);

// ------ Helpers: player names / scoreboard ------
const roundWinnerName = computed(() => {
  const winnerId = props.game?.currentRound?.winner;
  if (!winnerId || !props.game?.currentRound?.players) return null;
  const player = props.game.currentRound.players.find(
    (p) => p.playerName === winnerId
  );
  return player?.name ?? `Player ${winnerId}`;
});

const gameWinnerName = computed(() => {
  if (!gameWinnerId.value || !props.game?.players) return null;
  const player = props.game.players.find(
    (p) => p.playerName === Number(gameWinnerId.value)
  );
  return player?.name ?? `Player ${gameWinnerId.value}`;
});

const sortedPlayers = computed(() => {
  if (!props.game?.scores || !props.game?.players) return [];
  return Object.entries(props.game.scores)
    .map(([playerId, score]) => {
      const player = props.game?.players.find(
        (p) => p.playerName === Number(playerId)
      );
      return {
        name: player?.name ?? `Player ${playerId}`,
        score: score,
      };
    })
    .sort((a, b) => Number(b.score) - Number(a.score));
});


// ------ Timer control ------
let timerInterval: number | undefined;
const firedForThisTurn = ref(false);

const anyPopupOpen = computed(
  () =>
    popupStore.showChallenge ||
    popupStore.showChallengeResult ||
    popupStore.showChangeColor ||
    popupStore.showPlay
);

function clearTick() {
  if (timerInterval !== undefined) {
    clearInterval(timerInterval);
    timerInterval = undefined;
  }
}

function pauseTimer() {
  clearTick(); // keep current value
  isCritical.value = timer.value <= 8;
}

function resetTimerToFull() {
  clearTick();
  firedForThisTurn.value = false;
  timer.value = 20;
  isCritical.value = false;
}

function startOrResumeTimer() {
  if (timerInterval !== undefined) return; // already ticking
  timerInterval = window.setInterval(() => {
    timer.value--;
    if (timer.value <= 8) isCritical.value = true;

    if (timer.value <= 0) {
      clearTick();
      const isMyTurn =
        props.game?.currentRound?.currentPlayer === props.myPlayerId;
      if (!firedForThisTurn.value && roundgoing.value && isMyTurn) {
        firedForThisTurn.value = true;
        emit("timeUp");
      }
    }
  }, 1000);
}

// When current player or round winner changes, (re)decide timer behavior
watch(
  () => [props.game?.currentRound?.currentPlayer, props.game?.currentRound?.winner],
  () => {
    const isMyTurn = props.game?.currentRound?.currentPlayer === props.myPlayerId;
    const isRoundGoing = !!props.game && !props.game?.currentRound?.winner;

    if (!isMyTurn || !isRoundGoing) {
      // Not my turn or round ended -> fully reset display
      resetTimerToFull();
      return;
    }

    // It's my turn and round is going:
    if (anyPopupOpen.value) {
      // Pause while popup is visible
      pauseTimer();
    } else {
      // Resume/start with remaining time
      startOrResumeTimer();
    }
  },
  { immediate: true }
);

// Pause/resume live when popups open/close
watch(anyPopupOpen, (open) => {
  const isMyTurn = props.game?.currentRound?.currentPlayer === props.myPlayerId;
  const isRoundGoing = !!props.game && !props.game?.currentRound?.winner;

  if (!isMyTurn || !isRoundGoing) {
    resetTimerToFull();
    return;
  }

  if (open) pauseTimer();
  else startOrResumeTimer();
});

// Optional: if you want a fresh 20s whenever your turn begins:
let lastSeenPlayer: number | undefined;
watch(
  () => props.game?.currentRound?.currentPlayer,
  (now) => {
    const isMyTurn = now === props.myPlayerId;
    if (isMyTurn && lastSeenPlayer !== now) {
      resetTimerToFull();
      if (!anyPopupOpen.value && roundgoing.value) startOrResumeTimer();
    }
    lastSeenPlayer = now as number | undefined;
  },
  { immediate: true }
);

onUnmounted(() => clearTick());
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
          :class="{ current: index === rounds.length - 1 }"
        >
          <span class="rank">Round {{ index + 1 }}:</span>
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

    <!-- ROUND WINNER DISPLAY -->
    <div class="winner-section" v-if="roundEnded">
      <div class="winner-banner">
        🏆 Round Winner: {{ roundWinnerName }} 🏆
      </div>
      <button class="play-again" @click="emit('playAgain')">
        Start New Round
      </button>
    </div>

    <!-- GAME WINNER -->
    <button
      v-if="showPlayAgainAfterGame"
      class="play-again-final"
      @click="emit('endGame')"
    >
      {{ gameWinnerName }} won! Play Again
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

.empty {
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
  background-color: #2196f3;
  color: white;
  font-weight: bold;
  border: 2px solid #64b5f6;
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
  background: linear-gradient(135deg, #00b4d8, #0077b6);
  color: white;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}

.play-again:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-again:hover:enabled {
  background: linear-gradient(135deg, #0096c7, #023e8a);
  transform: translateY(-2px);
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

.winner-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.play-again-final {
  background: linear-gradient(135deg, #00b09b, #96c93d);
  color: white;
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  transition: 0.2s ease;
  margin-top: 25px;
}

.play-again-final:hover {
  background: linear-gradient(135deg, #00a86b, #7bb02d);
  transform: translateY(-2px);
}
</style>
