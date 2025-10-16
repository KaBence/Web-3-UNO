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
import {usePlayerStore} from "@/Stores/PlayerStore"
import { useRoute } from "vue-router";
import type { RefSymbol } from '@vue/reactivity';
import { Type } from 'Domain/src/model/Card';
import { usePopupStore, Popups } from "@/Stores/PopupStore"

const ongoingGameStore = useActiveGameStore()
const popupsStore = usePopupStore()
const playerStore = usePlayerStore()

const route = useRoute();
const queryGameId = route.query.id
let gameId: number = -1;

if (typeof queryGameId === "string") {
  gameId = parseInt(queryGameId)
}
else {
  alert("Invalid gameID is used")
}

const game = ongoingGameStore.getGame(gameId)

const currentGameId = computed(() => game?.value?.id);
const currentPlayerId = computed(() => game?.value?.currentRound?.currentPlayer);
const statusMessage = computed(() => game.value?.currentRound?.statusMessage ?? "")
const loggedInPlayer = computed(()=> game.value?.currentRound?.players.find(p=> p.name===playerStore.player))


async function onSayUno() {
  if (currentGameId.value === undefined || loggedInPlayer?.value?.playerName === undefined) {
    alert("Missing game or player ID!");
    return;
  }
  try {
    await api.sayUno(currentGameId.value, loggedInPlayer?.value?.playerName);
    alert("UNO called successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to call UNO 😢");
  }
}

async function onAccuseUno(accusedId: number) {
  if (currentGameId.value === undefined || loggedInPlayer?.value?.playerName === undefined) {
    alert("Missing game or player ID!");
    return;
  }
  try {
    await api.accuseUno(currentGameId.value, loggedInPlayer.value?.playerName, accusedId);
    alert(`You accused player ${accusedId} of not saying UNO!`);
  } catch (err) {
    console.error(err);
    alert("Failed to send accusation 😢");
  }
}

async function drawCard() {
  if(player.playerGameId === currentPlayerId.value){
    await api.drawCard(gameId)
    const canPlay = await api.canPlay(gameId, game.value?.currentRound?.players[player.playerGameId-1].hand.cards.length!-1)
    if (canPlay) {
      await popupsStore.openPopup(Popups.Play)
    }
    else{
      await api.play(gameId,-1)
    }
  }
}

async function playCard(cardId:number) {
  if (player.playerGameId === currentPlayerId.value) {
    let color = undefined;
    const cardType = game.value?.currentRound?.players[player.playerGameId - 1].hand.cards[cardId].type
    if (cardType === Type.Wild || cardType === Type.WildDrawFour) {
      await popupsStore.openPopup(Popups.ColorChange);
      color = popupsStore.colorSelected
      await api.play(gameId, cardId, color);
    } else {
      await api.play(gameId, cardId);
    }
  }
}

async function challengefour() {
  if (player.playerGameId === currentPlayerId.value) {
    await popupsStore.openPopup(Popups.Challenge)
  }
}

</script>

<template>
  <GameStatus />
  <StatusBar :message="statusMessage"/>
  <PlayersBar @accuse-uno="onAccuseUno" />
  <Decks @say-uno="onSayUno" @draw="drawCard" @play="playCard" @challenge="challengefour"/>
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