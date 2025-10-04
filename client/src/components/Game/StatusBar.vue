<script setup lang="ts">
import { ref } from 'vue';

// Define an enum for status messages
enum StatusMessages {
    Skipped = "{0} is skipped!",
    PointsFromPlayer = "{0} to {1}!",
    Reverse = "Direction Reversed!",
    WildColorChange = "Color Changed to {0}",
    Won = "You won!",
    Lost = "You lost! {0} won...",
}

// Function to format messages dynamically
function formatMessage(template: string, ...args: any[]): string {
    return template.replace(/{(\d+)}/g, (match, index) => args[index] || '');
}

const message = ref(formatMessage(StatusMessages.Reverse));

// Example data
const isYourTurn = ref(true);
const score = ref(120);
const arrowAngle = ref(180); 
</script>

<template>
    <div class="status-bar">
        <div class="message" v-if="message">{{ message }}</div>
        <div>
            <img src="../../../public/arrow.ico" alt="Kierunek gry" :style="{ transform: `rotate(${arrowAngle}deg)` }"
                class="arrow" />
        </div>
        <div class="turn-indicator" :class="{ active: isYourTurn }">
            <span v-if="isYourTurn">Your Turn</span>
            <span v-else="">Someone's turn</span>
        </div>
        <div class="score">
            Your Score: {{ score }}
        </div>
    </div>
</template>

<style scoped>
.status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f8f9fa;
    padding: 10px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
}

.message {
    background-color: #1e1e2f;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    color: white;
    padding: 5px 50px;
    border-radius: 8px;
    font-size: 20px;
    min-width: 40%;
    max-width: 60%;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.turn-indicator {
    background-color: #111111;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(124, 129, 125, 0.8);
}

.turn-indicator.active {
    background-color: #28a745;
    box-shadow: 0 0 10px rgba(40, 167, 69, 0.8);
}

.arrow {
    width: 50px;
    height: 100%;
}

.score {
    font-size: 16px;
    font-weight: bold;
    color: #343a40;
}
</style>