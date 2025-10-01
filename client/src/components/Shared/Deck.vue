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
import { DrawDeck } from "../../../../Domain/src/model/Deck";

const deck = new DrawDeck() // generates + shuffles automatically

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
