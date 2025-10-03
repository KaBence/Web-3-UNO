<script setup lang="ts">
import Popup from "@/components/Game/Popups/Popup.vue";
import { usePopupStore } from "../../../Stores/PopupStore";

const popupStore = usePopupStore();
</script>

<template>
  <Popup
    :visible="popupStore.showChallenge"
    title="Do you want to challenge the player?"
    :actions="[
      { label: 'Yes', onClick: popupStore.handleChallengeTrue },
      { label: 'No', onClick: popupStore.handleChallengeFalse }
    ]"
    
  />
</template>
