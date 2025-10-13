import type { PlayerNames } from 'Domain/src/model/Player'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('user', () => {
  const player = ref<string | undefined>(undefined)
  const loggedInPlayer = 1 as PlayerNames
  return { player, loggedInPlayer }
}, {
  persist: true,
})
