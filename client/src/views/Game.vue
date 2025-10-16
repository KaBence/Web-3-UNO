<script setup lang="ts">
import GameStatus from '@/components/Game/GameStatus.vue';
import StatusBar from '@/components/Game/StatusBar.vue';

import PlayersBar from '@/components/Game/PlayersBar.vue'
import PlayAfterDrawPopup from '@/components/Game/Popups/PlayAfterDrawPopup.vue'
import ChallengeDrawFourPopup from '@/components/Game/Popups/ChallengeDrawFourPopup.vue'
import ChooseColorPopup from '@/components/Game/Popups/ChooseColorPopup.vue'
import Decks from '@/components/Game/Decks.vue';
import ChallengeResultPopup from '@/components/Game/Popups/ChallengeResultPopup.vue';
import { computed, watch } from "vue";
import * as api from "@/model/api";
import { useActiveGameStore } from "../Stores/OngoingGameStore";
import {usePlayerStore} from "@/Stores/PlayerStore"
import { useRoute, useRouter } from "vue-router";
import type { RefSymbol } from '@vue/reactivity';
import { Type } from 'Domain/src/model/Card';
import { usePopupStore, Popups } from "@/Stores/PopupStore"

const route = useRoute();
const ongoingGameStore = useActiveGameStore()
const popupsStore = usePopupStore()
const playerStore = usePlayerStore()


const router = useRouter();
const gameId = Number(route.query.id);

const game = computed(() => ongoingGameStore.games.find(g => g.id === gameId));
const currentGameId = computed(() => game.value?.id);
const currentPlayerId = computed(() => game.value?.currentRound?.currentPlayer);
const loggedInPlayer = computed(()=> game.value?.currentRound?.players.find(p=> p.name===playerStore.player))
const statusMessage = computed(() => game.value?.currentRound?.statusMessage ?? "")

async function resetGame() {
  if (!game.value) return;

  try {
    console.log(" Ending game and removing players...");
    const gameId = game.value.id;

    //  Copy player list before modifying anything reactive
    const players = [...(game.value.players ?? [])];

    //  Remove each player one by one
    for (const player of players) {
      if (!player) {
        console.warn(" Skipping undefined player entry");
        continue;
      }

    
      const playerId =
        typeof player.playerName === "number"
          ? player.playerName
          : Number(player.playerName);

      if (isNaN(playerId)) {
        console.warn(" Skipping invalid player ID:", player);
        continue;
      }

      try {
        console.log(`Removing player ${player.name} (id: ${playerId})`);
        await api.removePlayer(gameId, playerId);
      } catch (err) {
        console.warn(` Could not remove player ${playerId}:`, err);
      }
    }
    ongoingGameStore.remove({ id: gameId });
    console.log("All players removed, game cleaned up, returned to lobby.");
  } 
  
  catch (err) {
    console.error(" Failed to end game (full error):", err);
    alert(
      `Failed to end game:\n${
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : JSON.stringify(err, null, 2)
      }`
    );
  }
}

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
    alert("Failed to call UNO ");
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
    alert("Failed to send accusation ");
  }
}

async function drawCard() {
  if(loggedInPlayer.value?.playerName === currentPlayerId.value){
    await api.drawCard(gameId)
    const canPlay = await api.canPlay(gameId, game.value?.currentRound?.players[loggedInPlayer.value?.playerName!-1].hand.cards.length!-1)
    if (canPlay) {
      await popupsStore.openPopup(Popups.Play)
    }
    else{
      await api.play(gameId,-1)
    }
  }
}

async function playCard(cardId:number) {
  if (loggedInPlayer.value?.playerName === currentPlayerId.value) {
    let color = undefined;
    const cardType = game.value?.currentRound?.players[loggedInPlayer.value?.playerName!-1].hand.cards[cardId].type
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
  if (loggedInPlayer.value?.playerName === currentPlayerId.value) {
    await popupsStore.openPopup(Popups.Challenge)
  }
}

async function startNewRound() {
  if (!game.value) return;

  try {
    console.log(" Starting a new round...");

    // Call backend to start new round
    if (!game.value) return;
    const updatedGame = await api.startRound(game.value.id);
    const clonedGame = structuredClone(updatedGame);
    ongoingGameStore.update(clonedGame);

    console.log("New round loaded.");
  } catch (err) {
    console.error(" Failed to start new round:", err);
    alert("Failed to start new round");
  }
}

watch(game, (newGame, oldGame) => {
  if (oldGame && !newGame) {
    console.log(`Game ${oldGame.id} has been removed. Navigating to lobby.`);
    router.push("/Lobby");
  }
})
</script>

<template>
  <GameStatus :game="game" @playAgain="startNewRound"@endGame="resetGame" />
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