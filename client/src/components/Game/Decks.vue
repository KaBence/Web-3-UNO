<template>
  <div class="board">
   

    <!-- Play area -->
    <div class="play-area">
      <div class="piles">
      
      </div>
    </div>
    <!-- UNO buttons -->
    <div class="button-row">
      <UnoButton @click="$emit('say-uno')"></UnoButton>
    </div>

    <!-- Player hand -->
    <div class="hand-area">
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { DrawDeck, DiscardDeck } from "../../../../Domain/src/model/Deck"
import type { Card as GameCard } from "../../../../Domain/src/model/Card"
import { useRoute } from "vue-router";
import UnoButton from "../Shared/UnoButton.vue"
import { useActiveGameStore } from "../../Stores/OngoingGameStore"

const route = useRoute();
const ongoingGameStore = useActiveGameStore()

const drawDeck = new DrawDeck()
const discardDeck = new DiscardDeck()

const cardsLeft = ref(drawDeck.size())
const playerHand = ref<GameCard[]>([])
const discardPile = ref<GameCard[]>(discardDeck.getCards())

defineEmits(["say-uno"]);

onMounted(() => {
  
})

function drawCard() {

  }

function playCard(card: GameCard) {
 
}


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
