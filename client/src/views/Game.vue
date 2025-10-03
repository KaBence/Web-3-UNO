<script setup lang="ts">
import GameStatus from '@/components/Game/GameStatus.vue';
import StatusBar from '@/components/Game/StatusBar.vue';

import PlayersBar from '@/components/Game/PlayersBar.vue'
import PlayAfterDrawPopup from '@/components/Game/PlayAfterDrawPopup.vue'
import ChallengeDrawFourPopup from '@/components/Game/ChallengeDrawFourPopup.vue'
import ChooseColorPopup from '@/components/Game/ChooseColorPopup.vue'
import Decks from '@/components/Game/Decks.vue';

</script>

<template>
  <GameStatus />
  <StatusBar />
  <PlayersBar />
  <Decks />

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