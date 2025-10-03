<template>
  <div class="deck">
    <Card
      v-for="(card, index) in deck.getCards()"
      :key="index"
      :card="card"
      @play="onPlay"
    />
  </div>
</template>

<script setup lang="ts">
import Card from "./Card.vue"
import { DrawDeck  } from "../../../../Domain/src/model/Deck";

//later replace with fetch() from backend
const deck = new DrawDeck() // generates + shuffles automatically


// here the canPlay and play should be called from backend
function onPlay(card: any) {
  console.log("Played:", card)
}
</script>

<style scoped>
.deck {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
}
</style>
