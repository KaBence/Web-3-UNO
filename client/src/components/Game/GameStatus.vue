<script setup lang="ts">
import { ref, computed , onMounted} from 'vue';
const players = ref([
    { name: 'Ben', score: 12 },
    { name: 'Anna', score: 50 },
]);

const rounds = ref([
    { winner: "Ben", points: 12 },
    { winner: "Anna", points: 50 }
])

const sortedPlayers = computed(() =>
    [...players.value].sort((a, b) => b.score - a.score)
);

function playAgain() {
    console.log('Play Again clicked!');
}

const roundgoing = ref(false);


// Timer logic
const timer = ref(10); // Start with 10 seconds
const isCritical = ref(false); // Tracks if the timer is in the critical state

function startTimer() {
    const interval = setInterval(() => {
        timer.value--;
        if (timer.value <= 5) {
            isCritical.value = true; // Change to critical state after 5 seconds
        }
        if (timer.value <= 0) {
            clearInterval(interval); // Stop the timer when it reaches 0
        }
    }, 1000); // Decrease timer every second
}

onMounted(() => {
    startTimer(); // Start the timer when the component is mounted
});
</script>

<template>
    <div class="gamestatus">
        <div class="timer" :class="{ critical: isCritical }">
            Time Left: {{ timer }}s
        </div>
        <div class="empty"></div>
        <div class="Rounds">
            <h1>Round History</h1>
            <div class="round-List">
                <div v-for="(round, index) in rounds" :key="index" class="player">
                    <span class="rank">Round {{ index + 1 }}: </span>
                    <span class="name">{{ round.winner }}</span>
                    <span class="score">{{ round.points }} Points</span>
                </div>
            </div>
        </div>
        <div class="empty"></div>
        <h1>Scoreboard</h1>
        <div class="player-list">
            <div v-for="(player, index) in sortedPlayers" :key="index" class="player">
                <span class="rank">{{ index + 1 }}</span>
                <span class="name">{{ player.name }}</span>
                <span class="score">{{ player.score }}</span>
            </div>
        </div>
        <button class="play-again" @click="playAgain" :class="{hidden: roundgoing}">Start new Round</button>
    </div>
</template>

<style scoped>
.gamestatus {
    display: block;
    justify-content: center;
    flex-direction: column;
    background-color: #1e1e2f;
    color: white;
    padding: 20px;
    border-radius: 10px;
    width: 40vh;
    height: 95vh;
    float: right;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.empty{
    height: 12vh;
}

h1 {
    font-size: 24px;
    margin-bottom: 20px;
}

.player-list {
    margin-bottom: 20px;
}

.player {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #2e2e3f;
    border-radius: 5px;
    margin-bottom: 10px;
}

.rank {
    font-weight: bold;
}

.name {
    flex: 1;
    text-align: left;
    margin-left: 10px;
}

.score {
    font-weight: bold;
}

.play-again {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.play-again.hidden{
    opacity: 0;
    pointer-events: none;
}

.play-again:hover {
    background-color: #0056b3;
}

.timer {
    font-size: 20px;
    font-weight: bold;
    color: white;
    background-color: #007bff;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
    transition: all 0.3s ease;
}

.timer.critical {
    background-color: red;
    animation: pulsate 1s infinite;
}

@keyframes pulsate {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>