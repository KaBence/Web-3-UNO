<script setup lang="ts">
import Popup from "@/components/Game/Popups/Popup.vue";
import Card from "../../Shared/Card.vue" 
import { usePopupStore } from "../../../Stores/PopupStore";
import { useRoute } from "vue-router";
import { useActiveGameStore } from "@/Stores/OngoingGameStore";
import { computed } from "vue";


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
const ongoingGameStore = useActiveGameStore()

const game = ongoingGameStore.getGame(gameId)
const currentPlayerId = computed(() => game?.value?.currentRound?.currentPlayer);

const playerHnad = computed(() => game.value?.currentRound?.players[currentPlayerId.value!-1].hand)
const index = computed(() => playerHnad.value?.cards.length! - 1) 
const card = computed(() => playerHnad.value?.cards[index.value])


</script>

<template>
  <Popup
    :visible="popupStore.showPlay"
    title="Do you want to play?"
    :actions="[
      { label: 'Play', onClick:() => popupStore.handlePlay(gameId,card!,index) },
      { label: 'Draw', onClick:() => popupStore.handleDraw(gameId) }
    ]"
  >
    <Card :key="1" :card="card!" />
  </Popup>
</template>

