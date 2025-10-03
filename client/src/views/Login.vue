<template>
  <div class="login-wrapper">
    <div class="card">
      <!-- UNO logo from PNG -->
      <img src="@/assets/uno-logo.png" alt="UNO logo" class="uno-logo" />

      <h2 class="title">Let's play UNO!</h2>

      <input
        class="input"
        type="text"
        v-model.trim="playerName"
        placeholder="Enter name"
        aria-label="Player name"
        @keyup.enter="goToLobby"
      />

      <button class="btn" type="button" @click="goToLobby">
        Create Player
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const playerName = ref("");
const router = useRouter();

function goToLobby() {
  const name = playerName.value;
  if (!name) return; // simple guard; add your own validation UI if you want
  router.push({ path: "/lobby", query: { name } }); //
}
</script>

<style scoped>
.login-wrapper {
  height: 100%;
  display: grid;
  place-items: center;
  background: #f3f4f6;
  padding: 24px;
}

.card {
  width: 360px;
  max-width: calc(100vw - 32px);
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 36px 28px 32px;
  text-align: center;
}

.uno-logo {
  width: 92px;
  height: auto;
  margin: 0 auto 16px;
  display: block;
}

.title {
  margin: 8px 0 14px;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 700;
  color: #1f2937;
}

.input {
  display: block;
  width: 100%;
  height: 44px;
  border: 0;
  outline: none;
  background: #f8fafc;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 16px;
  color: #111827;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.input::placeholder {
  color: #9ca3af;
}

.btn {
  margin-top: 16px;
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 10px;
  background: #34a853;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(52, 168, 83, 0.35);
}

.btn:hover {
  filter: brightness(1.03);
}
.btn:active {
  transform: translateY(1px);
}
</style>
    