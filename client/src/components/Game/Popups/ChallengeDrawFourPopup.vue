<script setup lang="ts">
import Popup from "@/components/Game/Popups/Popup.vue";
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
  <Popup
    :visible="popupStore.showChallenge"
    title="Do you want to challenge the player?"
    :actions="[
      { label: 'Yes', onClick: () => popupStore.handleChallengeTrue(gameId) },
      { label: 'No', onClick: () => popupStore.handleChallengeFalse(gameId) }
    ]"
    
  />
</template>
