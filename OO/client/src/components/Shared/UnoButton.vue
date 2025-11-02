<!-- UnoButton.vue -->
<template>
  <button class="uno-btn" @click="$emit('click')">
    <slot>UNO!</slot>
  </button>
</template>

<script setup lang="ts">
// Emits a simple click event
defineEmits<{ (e: 'click'): void }>()
</script>

<style scoped>
.uno-btn {
  background: linear-gradient(135deg, #ff4b2b, #ffcc00); /* red → yellow */
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  padding: 0.8rem 2rem;
  cursor: pointer;
  box-shadow: 0 4px 0 #b30000;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.uno-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #b30000;
}

.uno-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #b30000;
}
</style>
