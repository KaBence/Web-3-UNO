<template>
  <div class="pile" @click="onDraw">
    <div v-if="cardsLeft > 0" class="card-back">
      <div class="uno-oval"></div>
      <div class="uno-text">UNO</div>
      <span class="count">{{ cardsLeft }}</span>
    </div>
    <span v-else class="empty-text">Empty</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{ cardsLeft: number }>()
const emit = defineEmits<{ (e: "draw"): void }>()

const cardsLeft = computed(() => props.cardsLeft)

function onDraw() {
  if (cardsLeft.value > 0) emit("draw")
}
</script>

<style scoped>
.pile {
  width: 120px;
  height: 180px;
  border-radius: 15px;
  background: #fff;
  border: 2px solid #ddd;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.card-back {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background: black;
  border: 6px solid white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.uno-oval {
  position: absolute;
  width: 150%;
  height: 50%;
  background: rgb(211, 39, 39);
  border-radius: 500%;
  top: 25%;
  left: -25%;
  transform: rotate(-60deg);
  opacity: 0.9;
}

.uno-text {
  position: absolute;
  font-size: 28px;
  font-weight: 900;
  font-style: italic;
  color: #ffcc00;
  -webkit-text-stroke: 1.5px white;
  transform: rotate(-15deg);
  text-align: center;
  width: 100%;
  top: 40%;
}

.count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: white;
  color: black;
  font-weight: bold;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 6px;
}

.empty-text {
  font-size: 14px;
  color: #aaa;
}
</style>
