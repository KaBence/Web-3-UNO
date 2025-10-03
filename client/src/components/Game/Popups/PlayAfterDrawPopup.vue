<script setup lang="ts">
import Popup from "@/components/Game/Popups/Popup.vue";
import Card from "../../Shared/Card.vue" 
import {Type, WildCard} from "Domain/src/model/Card"
import { usePopupStore } from "../../../Stores/PopupStore";

const popupStore = usePopupStore();
const card = new WildCard(Type.Wild) //later get card from round store?
</script>

<template>
  <Popup
    :visible="popupStore.showPlay"
    title="Do you want to play?"
    :actions="[
      { label: 'Play', onClick: popupStore.handlePlay },
      { label: 'Draw', onClick: popupStore.handleDraw }
    ]"
  >
    <Card :key="1" :card="card" />
  </Popup>
</template>

