import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('user', () => {
  const player = ref<string|undefined>(undefined)
  let playerGameId = ref<number>(-1)
    const update = (gameId: number) => {
      playerGameId.value = gameId
      }
  return { player,playerGameId,update }
})
