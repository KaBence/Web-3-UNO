<template>
  <div class="chooseColorPopup">
    <h2>Choose a color</h2>
    <div class="buttons">
        <table>
            <tr>
                <td>
                    <button class="red" @click="chooseColor('red')">Red</button>
                </td>
                <td>
                    <button class="green" @click="chooseColor('green')">Green</button>
                </td>
            </tr>
            <tr>
                <td>
                    <button class="blue" @click="chooseColor('blue')">Blue</button>
                </td>
                <td>
                    <button class="yellow" @click="chooseColor('yellow')">Yellow</button>
                </td>
            </tr>
        </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';

const emit = defineEmits<{
  (e: 'color', color: string): void
}>();

function chooseColor(color: string) {
  emit('color', color);
}
</script>

<style scoped>
    .chooseColorPopup {
    background: rgba(205, 207, 206, 0.9);
    padding: 20px;
    border-radius: 10px;
    min-width: 300px;
    width: 30%;
    text-align: center;
    color: black;
    }

    .buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    gap: 10px;
    }

    button {
    padding: 10px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    font-weight: bold;
    flex: 1; /* równe przyciski */
    }

    button.red { background-color: #e74c3c; }
    button.green { background-color: #2ecc71; }
    button.blue { background-color: #3498db; }
    button.yellow { background-color: #f1c40f; }
</style>
