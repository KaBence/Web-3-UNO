<template>
  <div class="players-bar">
    <div v-for="player in players" :key="player.playerName" class="player-column">
      <div class="player-name">{{ player.name }}</div>

      <div class="player-hand">
        <div
          v-for="(card, index) in player.hand.cards.length"
          :key="index"
          class="card back"
          :style="{
              transform: `rotate(${index * 5 - (player.hand.cards.length * 2.5)}deg) 
              translateX(${index * 12 - (player.hand.cards.length * 12) / 2}px)`
            }"
        >
      </div>
      </div>
      <div class="call-uno">
        <button @click="$emit('accuse-uno', player.playerName)">UNO Accuse!</button>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { useActiveGameStore } from "@/Stores/OngoingGameStore"
  import { storeToRefs } from "pinia";
  import { usePlayerStore } from "@/Stores/PlayerStore";

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
  const playerStore = usePlayerStore()
  const { games } = storeToRefs(ongoingGameStore)

  const game = computed(() => games.value.find(g => g.id === gameId))
  const loggedInPlayer = computed(()=> game.value?.currentRound?.players.find(p=> p.name===playerStore.player))
  const players = computed(() => game.value?.currentRound?.players.filter(p=>p.name != loggedInPlayer?.value?.name))
  
  defineEmits<{(e: 'accuse-uno', playerId: number): void}>();

</script>

<style scoped>
  .players-bar {
    display: flex;
    justify-content: center;
    gap: 40px;
    background: #f7f7f7;
  }

  .player-column {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .player-name {
    text-align: center;
    width: 100;
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
  }

  .player-hand {
    position: relative;
    height: 160px;
    width: 200px;
    display: flex;
    justify-content: center;
  }

  .card {
    width: 80px;
    height: 120px;
    border-radius: 8px;
    border: 2px solid #000;
    position: absolute;
    background-size: cover;
    background-position: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }

  .card.back {
    background-image: url("../../../public/backsideUnoCard.ico"); 
  }

  .direction {
    margin-top: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .direction img {
    width: 50px;
    height: 50px;
    transition: transform 0.3s ease;
    transform-origin: center;
  }

  .call-uno button{
    background: linear-gradient(135deg, #000000, #ff1a1a); /* black → red */
    color: #fff;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 0.9rem; /* smaller text */
    border: none;
    border-radius: 30px; /* smaller radius for smaller button */
    padding: 0.5rem 1.5rem; /* less padding */
    cursor: pointer;
    letter-spacing: 0.5px; /* tighter spacing */
    box-shadow: 0 3px 0 #660000;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .call-uno :hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 0 #660000;
  }

  .call-uno :active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #660000;
}
</style>