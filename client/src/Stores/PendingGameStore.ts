import { computed, reactive, type Reactive } from "vue";
import { defineStore } from "pinia";
import type { GameSpecs } from "@/model/Specs";


export const usePendingGameStore = defineStore("pendingGame", () => {
  const gameList = reactive<GameSpecs[]>([])
  const games = computed((): Reactive<Readonly<GameSpecs[]>> => gameList)

  const update = (game: GameSpecs) => {
    const index = gameList.findIndex(g => g.id === game.id)
    if (index > -1) {
      gameList[index] = game
      return game
    }
  }

  const upsert = (game: GameSpecs) => {
    if (gameList.some(g => g.id === game.id)) {
      update(game)
    } else {
      gameList.push(game)
    }
  }

  const remove = (game: { id: number }) => {
    const index = gameList.findIndex(g => g.id === game.id)
    if (index > -1) {
      gameList.splice(index, 1)
    }
  }

  return { games, update, upsert, remove }
});
