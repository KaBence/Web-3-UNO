<template>
  <div class="hand">
    <UnoCard
      v-for="(c, i) in hand"
      :key="`${c.getType()}-${c.getNumber() ?? ''}-${i}`"
      :card="c"
      class="hand-card"
      :style="cardStyle(i, hand.length)"
      @play="$emit('play', c)"
    />
  </div>
</template>

<script setup lang="ts">
import UnoCard from "./Card.vue"
import type { Card } from "../../../../Domain/src/model/Card"

const props = defineProps<{ hand: Card[] }>()
const emit = defineEmits<{ (e: "play", card: Card): void }>()

// calculate curved spread
function cardStyle(index: number, total: number) {
  const angle = (index - (total - 1) / 2) * 8 // fan effect
  const shift = Math.abs(index - (total - 1) / 2) * 6
  return {
    transform: `rotate(${angle}deg) translateY(${shift}px)`,
    zIndex: index
  }
}
</script>

<style scoped>
.hand {
  display: flex;
  justify-content: center;
  gap: 0; /* overlap to make fan effect look nice */
  margin-top: 20px;
  min-width: calc(5 * 100px + 4 * 20px); 
   min-height: 180px;
}

.hand-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.hand-card:hover {
  transform: translateY(-30px) scale(1.05); /* lift hovered card */
  box-shadow: 0 8px 18px rgba(0,0,0,0.3);
  z-index: 999; /* bring hovered card on top */
}
</style>
