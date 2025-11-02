<script setup lang="ts">
import { onMounted } from 'vue';
import { usePendingGameStore } from './Stores/PendingGameStore';
import { useActiveGameStore } from './Stores/OngoingGameStore';
import * as api from './model/api'
import { RouterLink, RouterView } from 'vue-router'

const pendingGamesStore = usePendingGameStore()
const ongoingGamesStore = useActiveGameStore()


onMounted(async () => {
  // Call subscription handler ONCE.
  // This will listen for all ADDED, UPDATED, and REMOVED events.
  // Fetch the initial state of the game lists
  try {
    const [pending_games, ongoing_games] = await Promise.all([
      api.getPendingGames(),
      api.getActiveGames()
    ]);


    pending_games.forEach(pendingGamesStore.upsert);
    ongoing_games.forEach(ongoingGamesStore.upsert);
    
    console.log("✅ Initial game lists loaded:", {
      pending: pending_games.length,
      active: ongoing_games.length,
    });

    api.initializeGameSubscriptions();
    
  } catch (error) {
    console.error("Failed to fetch initial game lists:", error);
  }
});


</script>

<template>
  <RouterView />

  
</template>

