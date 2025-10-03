import { computed, reactive, type Reactive } from "vue";
import { defineStore } from "pinia";
import { Game } from "@/../domain/src/model/Game";
import { usePlayerStore } from "./PlayerStore";

export const usePendingGameStore = defineStore("pendingGame", {
  state: () => ({
    games: {} as Game[],
  }),
  getters: {
    players: (state) => state.pendingGame?.getPlayers() ?? [],
    targetScore: (state) => state.pendingGame?.getTargetScore() ?? 500,
    isReady: (state) => state.pendingGame?.isReady() ?? false,
  },
  actions: {
    createPendingGame(targetScore: number) {
      const playerStore = usePlayerStore();
      this.games.push(new Game(targetScore,7));
    },
    addPlayer(name : string) {
      this.pendingGame?.addPlayer(player);
    },
    removePlayer(playerId: string) {
      this.pendingGame?.(playerId);
    },
  },
});
