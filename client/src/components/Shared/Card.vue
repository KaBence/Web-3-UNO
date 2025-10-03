<template>
  <div class="uno-card" :class="colorClass" @click="handleClick">
    <!-- Corners -->
    <span v-if="showCorner" class="corner top-left">{{ cornerLabel }}</span>
    <span v-if="showCorner" class="corner bottom-right">{{ cornerLabel }}</span>

    <span v-if="isWild && card.getType() === Type.WildDrawFour" class="corner top-left">+4</span>
    <span v-if="isWild && card.getType() === Type.WildDrawFour" class="corner bottom-right">+4</span>

    <!-- Oval -->
    <div class="center-oval">
     
  <span class="center-text">{{ mainLabel }}</span>



      <!-- Wild -->
      <div v-if="isWild" class="wild-symbol">
        <div class="wild-square red"></div>
        <div class="wild-square yellow"></div>
        <div class="wild-square green"></div>
        <div class="wild-square blue"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { GameCardLike  as Card} from "../../utils/ui-types" 

//TODO remake to not use domain Card directly
import {  Type } from "../../../../Domain/src/model/Card";

const props = defineProps<{ card: Card }>()
const emit = defineEmits<{ (e: "play", payload: Card): void }>()

const card = props.card

const isWild = computed(() =>
  card.getType() === Type.Wild || card.getType() === Type.WildDrawFour
)

const isNumberOrDraw = computed(() =>
  card.getType() === Type.Numbered || card.getType() === Type.Draw
)


const mainLabel = computed(() => {
  switch (card.getType()) {
    case Type.Numbered: return (card.getNumber() ?? "").toString()
    case Type.Draw: return "+2"
    case Type.Skip: return "SKIP"
    case Type.Reverse: return "⇄"
    case Type.Wild: return ""
    case Type.WildDrawFour: return ""
    default: return ""
  }
})


const cornerLabel = computed(() => {
  switch (card.getType()) {
    case Type.Numbered: return card.getNumber()?.toString() ?? ""
    case Type.Draw: return "+2"
 
    default: return ""
  }
})

// hide corners for reverse & skip (to match official cards)
const showCorner = computed(() =>
  card.getType() === Type.Numbered || card.getType() === Type.Draw
)

const colorClass = computed(() =>
  isWild.value ? "card-black" : `card-${(card.getColor() ?? "black").toLowerCase()}`
)

function handleClick() { emit("play", card) }
</script>

<style scoped>
.uno-card {
  width: 100px;
  height: 160px;
  border-radius: 15px;
  border: 4px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 8px rgba(0,0,0,.4);
  cursor: pointer;
}

/* Backgrounds */
.card-red { background: #d62828; color: #fff; }
.card-yellow { background: #f1c40f; color: #000; }
.card-green { background: #2ecc71; color: #fff; }
.card-blue { background: #1e88e5; color: #fff; }
.card-black { background: #1c1c1c; color: #fff; }

/* Oval */
.center-oval {
  background: #fff;
  width: 72%;   /* was 80% */
  height: 62%;  /* was 70% */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-20deg);
  
}


/* Numbers/+2 */
.center-value {
  font-size: 46px;
  font-weight: 800;
  color: #000;
  -webkit-text-stroke: 1.5px #fff;
  transform: rotate(20deg);
}

.corner {
  position: absolute;
  font-size: 18px;                 /* slightly smaller than before */
  font-weight: 800;
  color: #fff;
  -webkit-text-stroke: 1px #000;
}

/* push corners closer to card edges */
.top-left { 
  top: 4px;       /* was 8px */
  left: 6px;      /* was 10px */
}

.bottom-right { 
  bottom: 4px;    /* was 8px */
  right: 6px;     /* was 10px */
  transform: rotate(180deg);
}

/* Wild */
.wild-symbol {
  width: 60%;
  height: 60%;
  display: grid;
  grid-template: 1fr 1fr / 1fr 1fr;
  gap: 2px;
  border-radius: 8px;
  transform: rotate(20deg);
}
.wild-square { width: 100%; height: 100%; }
.red { background: #d62828; }
.yellow { background: #f1c40f; }
.green { background: #2ecc71; }
.blue { background: #1e88e5; }

/* Skip */
.skip-icon {
  position: relative;
  width: 62%;
  aspect-ratio: 1;
  transform: rotate(20deg);
}
.skip-icon::before {
  content: "";
  position: absolute;
  inset: 0;
  border: 7px solid #000;
  border-radius: 50%;
}
.skip-icon::after {
  content: "";
  position: absolute;
  left: 14%;
  right: 14%;
  top: 50%;
  height: 7px;
  background: #000;
  transform: translateY(-50%) rotate(25deg);
  border-radius: 4px;
}

/* Reverse (circle + 2 separated arrows) */
.reverse-icon {
  
  position:relative;
  width: 62%;
  aspect-ratio: 1;
  transform: rotate(180deg);
}
.center-text {
  font-size: 26px;
  font-weight: 1000;
  color: #000;
  -webkit-text-stroke: 1.5px #fff; /* ensures visibility on yellow */
  text-transform: uppercase;
  text-align: center;
  transform: rotate(20deg);
}





</style>
