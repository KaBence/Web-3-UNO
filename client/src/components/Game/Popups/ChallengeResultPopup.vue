<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Popup from "@/components/Game/Popups/Popup.vue";
import PlayerHand from "../../Shared/PlayerHand.vue";
import type { HandSpecs } from "@/model/Specs"; // Use your own defined types
import { Popups, usePopupStore } from "../../../Stores/PopupStore";
import { useActiveGameStore } from "@/Stores/OngoingGameStore";

const route = useRoute();
const popupStore = usePopupStore();
const ongoingGameStore = useActiveGameStore();

const gameId = computed(() => {
  const id = route.query.id;
  return typeof id === "string" && !isNaN(parseInt(id)) ? parseInt(id) : -1;
});

const game = computed(() => ongoingGameStore.getGame(gameId.value)?.value);

const challengeHand = computed((): HandSpecs => {
  const round = game.value?.currentRound;
  
  if (!round || !round.players || round.players.length === 0) {
    return { cards: [] };
  }

  const { players, currentPlayer, currentDirection } = round;
  const currentPlayerIndex = players.findIndex((p) => p.playerName === currentPlayer);

  if (currentPlayerIndex === -1) {
    return { cards: [] };
  }

  let challengedPlayerIndex;
  if (currentDirection as String === "Clockwise") {
    challengedPlayerIndex = (currentPlayerIndex + 1) % players.length;
  } else {
    challengedPlayerIndex = (currentPlayerIndex - 1 + players.length) % players.length;
  }

  return players[challengedPlayerIndex]?.hand ?? { cards: [] };
});

const handStyle = computed(() => {
  return {
    '--num-cards': challengeHand.value.cards.length
  };
});
</script>

<template>
  <Popup
    :visible="popupStore.showChallengeResult"
    :title = '"Challenge Result:"'
    :actions="[
      { label: 'Ok', onClick: () => popupStore.closePopup(Popups.ChallengeResult) },
    ]"
  >
    <PlayerHand 
      :hand="challengeHand.cards" 
      class="popup-hand-wrapper"
      :style="handStyle"
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