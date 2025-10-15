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
import { useRoute, useRouter } from "vue-router";
import type { RefSymbol } from '@vue/reactivity';
import { Type } from 'Domain/src/model/Card';
import { usePopupStore, Popups } from "@/Stores/PopupStore"




const route = useRoute();
const router = useRouter();
const gameId = Number(route.query.id);

const ongoingGameStore = useActiveGameStore();
const playerStore = usePlayerStore();

// This correctly gets the reactive game object.
const game = computed(() => ongoingGameStore.games.find(g => g.id === gameId));

// --- THIS IS THE FIX ---

// Kept your original naming:
const currentGameId = computed(() => game.value?.id);
const currentPlayerId = computed(() => game.value?.currentRound?.currentPlayer);

// 1. Get your own display name from the player store.
const myPlayerName = playerStore.player;

// 2. Find your full player object within the game's data.
const me = computed(() => game.value?.players.find(p => p.name === myPlayerName));

// 3. Get YOUR unique numeric ID from that object.
const myPlayerId = computed(() => Number(me.value?.playerName));

// --- END OF FIX ---


async function resetGame() {
  if (!game.value) return;

  try {
    console.log("🧹 Ending game and removing players...");
    const gameId = game.value.id;

    // ✅ Copy player list before modifying anything reactive
    const players = [...(game.value.players ?? [])];

    // ✅ Remove each player one by one
    for (const player of players) {
      if (!player) {
        console.warn("⚠️ Skipping undefined player entry");
        continue;
      }

      // Resolve a valid numeric ID
      const playerId =
        typeof player.playerName === "number"
          ? player.playerName
          : Number(player.playerName);

      if (isNaN(playerId)) {
        console.warn("⚠️ Skipping invalid player ID:", player);
        continue;
      }

      try {
        console.log(`Removing player ${player.name} (id: ${playerId})`);
        await api.removePlayer(gameId, playerId);
      } catch (err) {
        console.warn(`❌ Could not remove player ${playerId}:`, err);
      }
    }

    // ✅ Once all players are removed, navigate away first
    await router.push("/Lobby");

    // ✅ Then remove from local store
    ongoingGameStore.remove({ id: gameId });

    console.log("✅ All players removed, game cleaned up, returned to lobby.");
  } catch (err) {
    console.error("❌ Failed to end game (full error):", err);
    alert(
      `Failed to end game:\n${
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : JSON.stringify(err, null, 2)
      }`
    );
  }
}


const popupsStore = usePopupStore()
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

async function playCard(cardId:number) {
  console.log(myPlayerId+" -> "+ game.value?.currentRound?.currentPlayer)
  if (myPlayerId.value === game.value?.currentRound?.currentPlayer) {
    let color = undefined;
    if (game.value?.currentRound?.players[(myPlayerId.value ?? 1) - 1].hand.cards[cardId].type === Type.Wild) {
      await popupsStore.openPopup(Popups.ColorChange);
      color = popupsStore.colorSelected
      await api.play(gameId, cardId, color);
    } else {
      await api.play(gameId, cardId);
    }
  }
}

async function startNewRound() {
  if (!game.value) return;

  try {
    console.log("🔁 Starting a new round...");

    // Call backend to start new round
    if (!game.value) return;
    const updatedGame = await api.startRound(game.value.id);
    const clonedGame = structuredClone(updatedGame);

    // Replace the old game in your Pinia store with the new one
    ongoingGameStore.update(clonedGame);

    console.log("✅ New round loaded.");
  } catch (err) {
    console.error("❌ Failed to start new round:", err);
    alert("Failed to start new round");
  }
}


</script>

<template>
  <GameStatus :game="game" @playAgain="startNewRound"@endGame="resetGame" />
  <StatusBar />
  <PlayersBar @accuse-uno="onAccuseUno" />
  <Decks @say-uno="onSayUno" @draw="drawCard" @play="playCard"/>
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