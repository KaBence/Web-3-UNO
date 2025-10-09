<template>
  <div class="board">
   

    <!-- Play area -->
    <div class="play-area">
      <div class="piles">
        <DrawPile :cards-left="cardsLeft" @draw="$emit('draw')"/>
      </div>
    </div>
    <!-- UNO buttons -->
    <div class="button-row">
      <UnoButton @click="$emit('say-uno')"></UnoButton>
    </div>

    <!-- Player hand -->
    <div class="hand-area">
        <PlayerHand :hand="hand" @play="$emit('play')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useRoute } from "vue-router";
import UnoButton from "../Shared/UnoButton.vue"
import { useActiveGameStore } from "@/Stores/OngoingGameStore"
import DrawPile from "@/components/Shared/DrawPile.vue"
import PlayerHand from "@/components/Shared/PlayerHand.vue"
import type { PlayerSpecs } from "@/model/Specs";

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
//const playerStore = use it to get player that is logged in

const game = ongoingGameStore.getGame(gameId)
const cardsLeft = computed(()=>(game.value?.currentRound?.drawDeckSize ?? 0));

//const player = playerStore.getPlayer() should return player taht isd using this browser
const player = game.value?.currentRound?.players[0] as PlayerSpecs
const hand = player.hand.cards


defineEmits(['say-uno','draw', 'play']);

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
