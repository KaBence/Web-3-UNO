<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Popup from "@/components/Game/Popups/Popup.vue";
import PlayerHand from "../../Shared/PlayerHand.vue";
import type { HandSpecs } from "@/model/Specs"; // Use your own defined types
import { Popups, usePopupStore } from "../../../Stores/PopupStore";
import { useActiveGameStore } from "@/Stores/OngoingGameStore";
import { Direction } from "Domain/src/model/Round";

const route = useRoute();
const popupStore = usePopupStore();
const ongoingGameStore = useActiveGameStore();

const gameId = computed(() => {
  const id = route.query.id;
  return typeof id === "string" && !isNaN(parseInt(id)) ? parseInt(id) : -1;
});

const game = computed(() => ongoingGameStore.getGame(gameId.value)?.value);
const result = computed(() => popupStore.challengeResult)

const challengeHand = computed<HandSpecs>(() => {
  const ctx = popupStore.challengeContext;

  // Prefer the exact snapshot/id captured at challenge time
  if (ctx?.handBeforeDraw?.cards) return ctx.handBeforeDraw;

  const round = game.value?.currentRound;
  if (!round || !round.players?.length) return { cards: [] };

  // If an id was provided but no snapshot (edge case), resolve by id
  if (ctx?.challengedPlayerId != null) {
    const p = round.players.find(pl => pl.playerName === ctx.challengedPlayerId);
    return p?.hand ?? { cards: [] };
  }

  // LAST RESORT: derive previous player from direction (ensure exact strings!)
  const idx = round.players.findIndex(p => p.playerName === round.currentPlayer);
  if (idx === -1) return { cards: [] };

  const clockwise = round.currentDirection === Direction.Clockwise;// make sure values are exactly "Clockwise"/"CounterClockwise"
  const challengedIdx = clockwise
    ? (idx - 1 + round.players.length) % round.players.length
    : (idx + 1) % round.players.length;

  return round.players[challengedIdx]?.hand ?? { cards: [] };
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
    :title = "result ? 'Challenge was successful!' : 'Challenge was unsuccessful!\nDraw 6!'"
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