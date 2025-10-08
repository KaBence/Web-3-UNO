<template>
  <div class="discard-pile">
    <div
      v-for="(c, i) in cards"
      :key="`${c.getType()}-${c.getNumber() ?? ''}-${i}`"
      class="card-wrapper"
      :style="{ zIndex: i }"
    >
      <UnoCard :card="c" />
    </div>
    <span v-if="cards.length === 0" class="empty-text">Empty</span>
  </div>
</template>

<script setup lang="ts">
import UnoCard from "./Card.vue"
import type { Card as GameCardLike } from "Domain/src/model/Card"

const props = defineProps<{ cards: GameCardLike[] }>()
</script>

<style scoped>
.discard-pile {
  position: relative;
  width: 120px;
  height: 180px;
  border: 2px solid #ccc;
  border-radius: 12px;
  background: #f9f9f9;
  overflow: hidden;
}
.card-wrapper {
  position: absolute;
  top: 0;
  left: 0;
}
.empty-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #888;
}
</style>
