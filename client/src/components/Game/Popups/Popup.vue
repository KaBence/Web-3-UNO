<template>
  <div v-if="visible" class="popup-overlay">
    <div class="popup-box">
      <header v-if="title">
        <h2>{{ title }}</h2>
      </header>

      <main class="popup-content">
        <slot />
      </main>

      <footer v-if="actions && actions.length">
        <button 
          v-for="(action, i) in actions" 
          :key="i" 
          @click="action.onClick"
        >
          {{ action.label }}
        </button>
      </footer>

      <footer v-else-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Action {
  label: string;
  onClick: () => void;
}

defineProps<{
  visible: boolean;
  title?: string;
  actions?: Action[];
}>();
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(30,30,47,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-box {
  background: #1e1e2f;
  color: #fff;
  padding: 20px 30px;
  border-radius: 12px;
  min-width: 300px;
  max-width: 80vh;
  max-height: 80vh;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
}

.popup-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
  overflow-y: auto;         /* scroll tylko jeśli za dużo kart */
  max-height: calc(80vh - 120px); /* odejmujemy header + footer */
}


header h2 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: bold;
}

footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

button {
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #fff;
  background: #007bff;
  transition: background 0.2s;
}

button:hover {
  background: #0056b3;
}
</style>
