<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import PlayersBar from './components/Game/PlayersBar.vue'
import PlayAfterDrawPopup from './components/Game/PlayAfterDrawPopup.vue'
import ChallengeDrawFourPopup from './components/Game/ChallengeDrawFourPopup.vue'
import ChooseColorPopup from './components/Game/ChooseColorPopup.vue'

import { challengDrawFour, selectColor } from "./services/gameService";
import { ref } from 'vue';

const showPopup = ref(false);
const showColorPopup = ref(true);

function closeChallengePopup() {
  showPopup.value = false;
}

function closeColorPopup() {
  showColorPopup.value = false;
}

function handleYes() {
  challengDrawFour(true);
  closeChallengePopup();
}

function handleNo() {
  challengDrawFour(false);
  closeChallengePopup();
}

function chooseColor(color: string) {
  selectColor(color);
  closeColorPopup();
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <div v-if="showPopup" class="popup-overlay" @click.self="closeChallengePopup">
    <div class="popup-wrapper">
      <ChallengeDrawFourPopup @yes="handleYes" @no="handleNo" />
    </div>
  </div>

  <div v-if="showColorPopup" class="popup-overlay" @click.self="closeColorPopup">
    <div class="popup-wrapper">
      <ChooseColorPopup @color="chooseColor" />
    </div>
  </div>

  <div class="game-ui">
    <PlayersBar />
    <PlayAfterDrawPopup />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
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
