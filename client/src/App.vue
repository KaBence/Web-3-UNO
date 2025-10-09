<script setup lang="ts">
import { onMounted } from 'vue';
import { usePendingGameStore } from './Stores/PendingGameStore';
import { useActiveGameStore } from './Stores/OngoingGameStore';
import * as api from './model/api'
import { RouterLink, RouterView } from 'vue-router'

  const pendingGamesStore = usePendingGameStore()
  const ongoingGamesStore = useActiveGameStore()


  function liveUpdateGames() {
    api.onGame(game => {
      ongoingGamesStore.upsert(game);
      pendingGamesStore.remove(game);
    });
    api.onPending(pendingGamesStore.upsert);
  }


onMounted(async () => {
  liveUpdateGames(); // ✅ subscribe first
  const [pending_games, ongoing_games] = await Promise.all([
    api.getPendingGames(),
    api.getActiveGames()
  ]);

  pending_games.forEach(pendingGamesStore.upsert);
  ongoing_games.forEach(ongoingGamesStore.upsert);
});


</script>

<template>
  <RouterView />

  
</template>

<!-- <style scoped>


header {
  line-height: 1.5;
  max-height: 100vh;
}

import Decks from "./components/Game/Decks.vue"
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.game-ui {
  background-color: rgb(143, 84, 84);
  background-image: url('/Uno-Logo.ico');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
-->