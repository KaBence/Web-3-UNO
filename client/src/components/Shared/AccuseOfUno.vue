<template>
  <button class="call-uno-btn" @click="$emit('click')">
    <slot> Accuse player of UNO!</slot>
  </button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>()
</script>

<style scoped>
.call-uno-btn {
  background: linear-gradient(135deg, #000000, #ff1a1a); /* black → red */
  color: #fff;
  font-weight: 900;
  text-transform: uppercase;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  padding: 0.9rem 2.5rem;
  cursor: pointer;
  letter-spacing: 1px;
  box-shadow: 0 4px 0 #660000;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.call-uno-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #660000;
}

.call-uno-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #660000;
}
</style>
