<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from "vue-router";
import type { GameSpecs } from '@/model/Specs';
import type { PropType } from 'vue';


const emit = defineEmits(['playAgain', 'endGame']);

const props = defineProps({
  game: {
    type: Object as PropType<GameSpecs | undefined>,
    required: true,
  },
});

const router = useRouter();

// Local UI state
const rounds = ref<{ winner: string; points: number }[]>([]);
const lastScores = ref<Record<number, number>>({});

const timer = ref(20);
const isCritical = ref(false);

const roundEnded = computed(() => !!props.game?.currentRound?.winner);
const roundgoing = computed(() => !roundEnded.value); 
const gameWinnerId = computed(() => props.game?.winner ?? null);
const showPlayAgainAfterGame = computed(() => {
  return !!props.game?.winner;
});


// This finds the name of the winner for the CURRENT round
const roundWinnerName = computed(() => {
  const winnerId = props.game?.currentRound?.winner;
  if (!winnerId || !props.game?.currentRound?.players) return null;
  const player = props.game.currentRound.players.find(p => p.playerName === winnerId);
  return player?.name ?? `Player ${winnerId}`;
});

// This finds the name of the winner for the ENTIRE game
const gameWinnerName = computed(() => {
  if (!gameWinnerId.value || !props.game?.players) return null;
  const player = props.game.players.find(p => p.playerName === Number(gameWinnerId.value));
  return player?.name ?? `Player ${gameWinnerId.value}`;
});

// This computes the scoreboard safely
const sortedPlayers = computed(() => {
  if (!props.game?.scores || !props.game?.players) return [];
  return Object.entries(props.game.scores)
    .map(([playerId, score]) => {
      const player = props.game?.players.find(p => p.playerName === Number(playerId));
      return {
        name: player?.name ?? `Player ${playerId}`,
        score: score,
      };
    })
    .sort((a, b) => Number(b.score) - Number(a.score));
});


let timerInterval: number | undefined;
function startOrResetTimer() {
  clearInterval(timerInterval);
  timer.value = 20;
  isCritical.value = false;
  timerInterval = setInterval(() => {
    timer.value--;
    if (timer.value <= 8) isCritical.value = true;
    if (timer.value <= 0) clearInterval(timerInterval);
  }, 1000);
}

watch(() => props.game?.currentRound?.currentPlayer, () => {
  if (roundgoing.value) { 
    startOrResetTimer();
  }
}, { immediate: true });

watch(() => props.game?.currentRound?.winner, (newWinnerId) => {
  if (!newWinnerId || !props.game?.currentRound || !props.game?.scores) return;

  // find winner info
  const winnerPlayer = props.game.players.find(p => p.playerName === newWinnerId);
  if (!winnerPlayer) return;

  // compute points won THIS round
  const currentScores = props.game.scores;
  const prevScore = Number(lastScores.value[newWinnerId] ?? 0);
  const currentScore = Number(currentScores[newWinnerId] ?? 0);
  const pointsWon = currentScore - prevScore;

  // record this round in the round history
  rounds.value.push({ winner: `${winnerPlayer.name}`, points: pointsWon });

  // update last scores snapshot
  lastScores.value = Object.fromEntries(
    Object.entries(currentScores).map(([k, v]) => [Number(k), Number(v)])
  );
}, { deep: true });

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
  <span class="rank">
    Round {{ index + 1 }}:
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
    <div class="winner-section" v-if="roundEnded">
  <div class="winner-banner">
    🏆  Round Winner: {{ roundWinnerName }} 🏆
  </div>
  <button class="play-again" @click="emit('playAgain');">
    Start New Round
  </button>
</div>

   <!-- Only show this if the entire game has a winner -->
<button
  v-if="showPlayAgainAfterGame"
  class="play-again-final"
  @click="
  emit('endGame');">
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
  background-color: #2196f3; /* blue highlight */
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
  gap: 15px; /* spacing between banner and button */
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
  transition: all 0.2s ease;
  margin-top: 25px;
}

.play-again-final:hover {
  background: linear-gradient(135deg, #00a86b, #7bb02d);
  transform: translateY(-2px);
}

</style>