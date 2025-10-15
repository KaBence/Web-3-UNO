import { computed, reactive, ref, type Reactive } from "vue";
import { defineStore } from "pinia";
import type { GameSpecs, PlayerSpecs } from "@/model/Specs";



export const useActiveGameStore = defineStore("activeGames", () => {
  const gameList = reactive<GameSpecs[]>([])
  const games = computed((): Reactive<Readonly<GameSpecs[]>> => gameList)
  const getGame = (id: number) => computed(() => gameList.find(g => g.id === id))


const update = (game: GameSpecs) => {
  // Always deep clone to kill shared refs
  const cloned = structuredClone(game);

  const index = gameList.findIndex(g => g.id === cloned.id);

  if (index > -1) {
     gameList[index] = cloned;
  
  } else {
    gameList.push(cloned);
  }

  return cloned;
};



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



  return {
    gameList,
    games,
    update,
    upsert,
    remove,
    getGame
  }
});
