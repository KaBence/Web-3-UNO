import type { PlayerNames } from 'Domain/src/model/Player'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('user', () => {
  const player = ref<string | undefined>(undefined)
  const loggedInPlayer = 1 as PlayerNames
  let playerGameId = ref<number>(-1)
    const update = (gameId: number) => {
      playerGameId.value = gameId
      }
  return { player, loggedInPlayer,playerGameId,update }
}, {
  persist: true,
})
