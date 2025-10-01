<template>
  <div class="players-bar">
    <div v-for="player in players" :key="player.getID()" class="player-column">
      <h3 class="player-name">{{ player.getID() }}</h3>

      <div class="player-hand">
        <div
          v-for="(card, index) in player.getHand().size()"
          :key="index"
          class="card back"
          :style="{
            transform: `rotate(${index * 5 - (player.getHand().size() * 2.5)}deg) translateX(${index * 12}px)`
          }"
        ></div>
      </div>
    </div>
  </div>
  <div class="direction">
    <img
      src="../../../public/arrow.ico"
      alt="Kierunek gry"
      :style="{ transform: `rotate(${arrowAngle}deg)` }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import { getPlayers, getDirection} from "../../services/gameService";
  import type { Player } from "../../../../Domain/src/model/Player";

  const arrowAngle = ref(0); 



  const players = ref<Player[]>([]);

  onMounted(async () => {
    players.value = await getPlayers();
    arrowAngle.value = await getDirection(); 
  });
</script>

<style scoped>
  .players-bar {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 20px;
  }

  .player-column {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .player-name {
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
  }

  .player-hand {
    position: relative;
    height: 160px;
    width: 200px;
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

</style>