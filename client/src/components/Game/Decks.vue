<template>
  <div class="board">
   

    <!-- Play area -->
    <div class="play-area">
      <div class="piles">
        <DrawPile :cards-left="cardsLeft" @draw="$emit('draw')"/>
        <DiscardPile 
          :top-card="topCard"
          :key="`${topCard?.color}-${topCard?.type}-${topCard?.number}`"
        />
      </div>
    </div>
    <!-- UNO buttons -->
    <div class="button-row">
      <UnoButton @click="$emit('say-uno')"></UnoButton>
    </div>

    <!-- Player hand -->
    <div class="hand-area">
        <PlayerHand :hand="hand" @play="(cardIndex) => $emit('play', cardIndex)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed , watch} from "vue"
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import UnoButton from "../Shared/UnoButton.vue"
import { useActiveGameStore } from "@/Stores/OngoingGameStore"
import { usePlayerStore } from "@/Stores/PlayerStore";
import DrawPile from "@/components/Shared/DrawPile.vue"
import DiscardPile from "@/components/Shared/DIscardPile.vue"
import PlayerHand from "@/components/Shared/PlayerHand.vue"
import { Type } from "Domain/src/model/Card";

const emit = defineEmits(['say-uno','draw', 'play', 'challenge','setWildColor']);

const route = useRoute();
const queryGameId = route.query.id
let gameId: number = -1;
if (typeof queryGameId === "string") {
  gameId = parseInt(queryGameId)
}
else {
  alert("Invalid gameID is used")
}
const ongoingGameStore = useActiveGameStore()
const playerStore = usePlayerStore();
const myPlayerName = playerStore.player; 
//const playerStore = use it to get player that is logged in

const { games } = storeToRefs(ongoingGameStore)
const game = computed(() => games.value.find(g => g.id === gameId))
const loggedInPlayer = computed(()=> game.value?.currentRound?.players.find(p=> p.name===playerStore.player))

const cardsLeft = computed(() => game.value?.currentRound?.drawDeckSize ?? 0)
const player = computed(() => {
  // Find the player in the game's player list whose name matches your name
  return game.value?.currentRound?.players.find(p => p.name === myPlayerName);
});
const hand = computed(() => player.value?.hand?.cards ?? [])
const topCard = computed(() => game.value?.currentRound?.topCard);

watch(
  [topCard, () => game.value?.currentRound?.currentPlayer],
  ([newTopCard, newPlayer], [oldTopCard, oldPlayer]) => {
    const isMyTurn = player.value?.playerName === newPlayer;
    const isChallengeCard = newTopCard?.type === Type.DummyDraw4;
    const cardWasJustPlayed = oldTopCard?.type !== Type.DummyDraw4;
    const statusMessage = game.value?.currentRound?.statusMessage || "";

    if (isMyTurn && isChallengeCard && cardWasJustPlayed) {
      emit('challenge');
    }
    if (isMyTurn && newTopCard?.type === Type.Wild && statusMessage.includes("Round Created")) {
      emit('setWildColor')
    }
  },
  { deep: true, immediate: true}
);

</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin-top: 20px;
  font-family: 'Segoe UI', sans-serif;
  background: #f7f7f7; /* light background */
  min-height: 100vh;
  padding: 20px;
}
/* Button row */
.button-row {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.title {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #d62828; /* UNO red */
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}

/* Play area */
.play-area {
  background: white;
  border: 3px solid #ddd;
  border-radius: 20px;
  padding: 40px 60px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
}

.piles {
  display: flex;
  gap: 120px;
  align-items: center;
}

/* Hand area */
.hand-area {
  margin-top: 10px;

  border-radius: 15px;
  background: #fff;
  border: 2px solid #ddd;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
