<script setup lang="ts">
import Popup from "@/components/Game/Popups/Popup.vue";
import {Colors} from "Domain/src/model/Card"
import { usePopupStore } from "../../../Stores/PopupStore";
import { useRoute } from "vue-router";

const route = useRoute();
const queryGameId = route.query.id
let gameId: number = -1;
if (typeof queryGameId === "string") {
  gameId = parseInt(queryGameId)
}
else {
  alert("Invalid gameID is used")
}

const popupStore = usePopupStore();
</script>

<template>
  <Popup :visible="popupStore.showChangeColor" title="Choose color:">
    <template #footer>
      <div class="color-grid">
        <button class="red" @click="popupStore.handleChooseColor(gameId,Colors.Red)">Red</button>
        <button class="blue" @click="popupStore.handleChooseColor(gameId,Colors.Blue)">Blue</button>
        <button class="yellow" @click="popupStore.handleChooseColor(gameId,Colors.Yellow)">Yellow</button>
        <button class="green" @click="popupStore.handleChooseColor(gameId,Colors.Green)">Green</button>
      </div>
    </template>
  </Popup>
</template>

<style scoped>
.color-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.color-grid button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-grid button:hover {
  transform: scale(1.1);
}


.red {
  background-color: #e74c3c;
}

.blue {
  background-color: #3498db;
}

.yellow {
  background-color: #f1c40f;
  color: #000; 
}

.green {
  background-color: #2ecc71;
}
</style>
