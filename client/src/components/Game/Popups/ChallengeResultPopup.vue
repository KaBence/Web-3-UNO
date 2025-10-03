<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Popup from "@/components/Game/Popups/Popup.vue";
import PlayerHand from "../../Shared/PlayerHand.vue" 
import {Card} from "Domain/src/model/Card"
import { Popups, usePopupStore } from "../../../Stores/PopupStore";

const popupStore = usePopupStore();
const playerHand = ref<Card[]>([])
const result = computed(() => popupStore.challengeResult)

//tyhis part should be changed to get specificPlayers hand
import { DrawDeck } from "../../../../../Domain/src/model/Deck"
const drawDeck = new DrawDeck()
const cardsLeft = ref(drawDeck.size())

onMounted(() => {
  for (let i = 0; i < 5; i++) {
    const card = drawDeck.deal()
    if (card) playerHand.value.push(card)
  }
  cardsLeft.value = drawDeck.size()
})

</script>

<template>
  <Popup
    :visible="popupStore.showChallengeResult"
    :title="result ? 'Challenge was successful!' : 'Challenge was unsuccessful!\nDraw 6!'"
    :actions="[
      { label: 'Ok', onClick: () => popupStore.closePopup(Popups.ChallengeResult) },
    ]"
  >
    <PlayerHand 
      :hand="playerHand" 
      class="popup-hand-wrapper"
      :style="{'--num-cards': playerHand.length}"
    />
  </Popup>
</template>

<style>
  .popup-hand-wrapper {
    transform: scale(calc(1 - (var(--num-cards) / 50)));
    transform-origin: top center;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1px;
  }
</style>

