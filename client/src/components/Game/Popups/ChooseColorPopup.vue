<script setup lang="ts">
import Popup from "@/components/Game/Popups/Popup.vue";
import {Colors} from "Domain/src/model/Card"
import { usePopupStore } from "../../../Stores/PopupStore";

const popupStore = usePopupStore();
</script>

<template>
  <Popup :visible="popupStore.showChangeColor" title="Choose color:">
    <template #footer>
      <div class="color-grid">
        <button class="red" @click="popupStore.handleChooseColor(Colors.Red)">Red</button>
        <button class="blue" @click="popupStore.handleChooseColor(Colors.Blue)">Blue</button>
        <button class="yellow" @click="popupStore.handleChooseColor(Colors.Yellow)">Yellow</button>
        <button class="green" @click="popupStore.handleChooseColor(Colors.Green)">Green</button>
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
