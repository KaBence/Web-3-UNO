<template>
  <div class="discard-pile">
      <span v-if="topCard === undefined" class="empty-text">Empty</span>
    <div v-else>
      <UnoCard :card="topCard" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UnoCard from "./Card.vue"
import type { CardSpecs } from "@/model/Specs";

const props = defineProps<{ topCard: CardSpecs | undefined}>()
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
