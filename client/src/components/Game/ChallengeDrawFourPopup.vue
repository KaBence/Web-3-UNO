<template>
  <div class="challengDrawFour">
    <h2>Do you want to challge the player?</h2>
    <div class="buttons">
      <button @click="onYes">Yes</button>
      <button @click="onNo">No</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import { defineEmits } from "vue";

    const emit = defineEmits<{
    (e: 'yes'): void
    (e: 'no'): void
    }>();

    function onYes() {
    emit('yes');
    }

    function onNo() {
    emit('no');
    }
</script>

<style scoped>
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

    .challengDrawFour {
    background: rgba(205, 207, 206, 0.8); 
    padding: 20px;
    border-radius: 10px;
    min-width: 300px;
    width: 25%;
    text-align: center;
    color: black;
    }

    .buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    }

    button {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    }

/*
    chat gpt claim that this should be done to align it int parent compoenent:
    in template:
        <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
            <div class="popup-wrapper">
                <challengDrawFour @yes="onYes" @no="onNo" />
            </div>
        </div>
    
    in css:
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

    
*/

</style>