import { computed, reactive, ref, type Reactive } from "vue";
import { defineStore } from "pinia";
import type { GameSpecs, PlayerSpecs } from "@/model/Specs";
import * as api from "@/model/api"; 


export const useActiveGameStore = defineStore("activeGames", ()=>{
  const gameList = reactive<GameSpecs[]>([])
  const games = computed((): Reactive<Readonly<GameSpecs[]>> => gameList)
  

  const currentGame = ref<GameSpecs | null>(null);
  const currentPlayer = ref<PlayerSpecs | null>(null);

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

  const remove = (game: {id: number}) => {
    const index = gameList.findIndex(g => g.id === game.id)
    if (index > -1) {
      gameList.splice(index, 1)
    }
  }
  


  return {
     games,
     currentGame,
     currentPlayer,
     update,
     upsert,
     remove,
    }
});
