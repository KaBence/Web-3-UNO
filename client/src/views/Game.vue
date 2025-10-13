<script setup lang="ts">
import GameStatus from '@/components/Game/GameStatus.vue';
import StatusBar from '@/components/Game/StatusBar.vue';

import PlayersBar from '@/components/Game/PlayersBar.vue'
import PlayAfterDrawPopup from '@/components/Game/Popups/PlayAfterDrawPopup.vue'
import ChallengeDrawFourPopup from '@/components/Game/Popups/ChallengeDrawFourPopup.vue'
import ChooseColorPopup from '@/components/Game/Popups/ChooseColorPopup.vue'
import Decks from '@/components/Game/Decks.vue';
import ChallengeResultPopup from '@/components/Game/Popups/ChallengeResultPopup.vue';
import { computed } from "vue";
import * as api from "@/model/api";
import { useActiveGameStore } from "../Stores/OngoingGameStore";
import { useRoute } from "vue-router";
import type { RefSymbol } from '@vue/reactivity';



const route = useRoute();
const queryGameId = route.query.id
let gameId: number = -1;
if (typeof queryGameId === "string") {
  gameId = parseInt(queryGameId)
}
else {
  alert("Invalid gameID is used")
}
const ongoingGameStore = useActiveGameStore()

const game = ongoingGameStore.getGame(gameId)

const currentGameId = computed(() => game?.value?.id);
const currentPlayerId = computed(() => game?.value?.currentRound?.currentPlayer);


async function onSayUno() {
  if (currentGameId.value === undefined || currentPlayerId.value === undefined) {
    alert("Missing game or player ID!");
    return;
  }
  try {
    await api.sayUno(currentGameId.value, currentPlayerId.value);
    alert("UNO called successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to call UNO 😢");
  }
}

async function onAccuseUno(accusedId: number) {
  if (currentGameId.value === undefined || currentPlayerId.value === undefined) {
    alert("Missing game or player ID!");
    return;
  }
  try {
    await api.accuseUno(currentGameId.value, currentPlayerId.value, accusedId);
    alert(`You accused player ${accusedId} of not saying UNO!`);
  } catch (err) {
    console.error(err);
    alert("Failed to send accusation 😢");
  }
}

async function drawCard() {
  await api.drawCard(gameId)
}

</script>

<template>
  <GameStatus :gameId="gameId" />
  <StatusBar />
  <PlayersBar @accuse-uno="onAccuseUno" />
  <Decks @say-uno="onSayUno" @draw="drawCard"/>
  <ChallengeDrawFourPopup />
  <ChallengeResultPopup />
  <ChooseColorPopup />
  <PlayAfterDrawPopup />

</template>

<style>
body {
  overflow: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}
</style>