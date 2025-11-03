import { defineStore } from "pinia";
import { Colors, Type } from "Domain/src/model/Card";
import * as api from "@/model/api";
import type { CardSpecs, HandSpecs } from "@/model/Specs";
import { useActiveGameStore } from "./OngoingGameStore";
import { Direction } from "Domain/src/model/Round";
import { toRaw, isReactive } from "vue";     

function toPlain<T>(v: T): T {
  const raw = isReactive(v) ? toRaw(v as any) : v;
  return JSON.parse(JSON.stringify(raw));
}

export enum Popups {
  Challenge = "Challenge",
  ChallengeResult = "ChallengeResult",
  ColorChange = "ColorChange",
  Play = "Play",
}


type ChallengeContext = {
  challengedPlayerId: number;
  handBeforeDraw: HandSpecs;
};

export const usePopupStore = defineStore("popup", {
  state: () => ({
    showChallenge: false,
    showChallengeResult: false,
    showChangeColor: false,
    showPlay: false,
    challengeResult: false,
    colorSelected: "",
    challengeContext: undefined as ChallengeContext | undefined,
    _popupResolve: undefined as undefined | (() => void),
  }),

  actions: {
    openPopup(popup: Popups, result?: boolean) {
      switch (popup) {
        case Popups.Challenge:
          this.showChallenge = true;
          break;
        case Popups.ChallengeResult:
          this.challengeResult = !!result;
          this.showChallengeResult = true;
          break;
        case Popups.ColorChange:
          this.showChangeColor = true;
          break;
        case Popups.Play:
          this.showPlay = true;
          break;
      }

      return new Promise<void>((resolve) => {
        this._popupResolve = resolve;
      });
    },

    closePopup(popup: Popups) {
      switch (popup) {
        case Popups.Challenge:
          this.showChallenge = false;
          break;
        case Popups.ChallengeResult:
          this.showChallengeResult = false;
          this.challengeContext = undefined;    
          break;
        case Popups.ColorChange:
          this.showChangeColor = false;
          break;
        case Popups.Play:
          this.showPlay = false;
          break;
      }

      if (this._popupResolve) {
        this._popupResolve();
        this._popupResolve = undefined;
      }
    },
    
    openChallengeResultWithSnapshot(payload: {
      result: boolean;
      challengedPlayerId: number;
      handBeforeDraw: HandSpecs;
    }) {
      this.challengeResult = payload.result;
      this.challengeContext = {
        challengedPlayerId: payload.challengedPlayerId,
        handBeforeDraw: toPlain(payload.handBeforeDraw),
      };
      this.showChallengeResult = true;
    },

   async handleChallengeTrue(gameId: number) {
      if (gameId === -1) return;

      // 1) Snapshot challenged player's hand BEFORE API call
      const ongoing = useActiveGameStore();
      const game = ongoing.getGame(gameId)?.value;
      const round = game?.currentRound;
      if (!round?.players?.length) return;

      // In Draw4 challenge, the "challenged" is the player who played WDF.
      // That is the previous player relative to the current player in the current direction.
      const players = round.players;
      const currIdx = players.findIndex(p => p.playerName === round.currentPlayer);
      if (currIdx === -1) return;

      const clockwise = round.currentDirection === Direction.Clockwise;
      const challengedIdx = clockwise
        ? (currIdx - 1 + players.length) % players.length
        : (currIdx + 1) % players.length;

      const challenged = players[challengedIdx];

      const handBeforeDraw: HandSpecs = toPlain({
            cards: challenged.hand.cards,
          });

      this.openChallengeResultWithSnapshot({
        result: false, // temporary; will set real result after API
        challengedPlayerId: challenged.playerName,
        handBeforeDraw,
      });

      // 2) Now call API (which will mutate state)
      const result = await api.challengeDraw4(gameId, true);

      // 3) Update only the boolean result in the already-open popup
      this.challengeResult = result;
      this.closePopup(Popups.Challenge);
    },

    async handleChallengeFalse(gameId: number) {
      if (gameId === -1) return;
      await api.challengeDraw4(gameId, false);
      this.closePopup(Popups.Challenge);
    },

    handleChooseColor(gameId: number, color: Colors) {
      if (gameId === -1) return;
      this.colorSelected = color.toString();
      this.closePopup(Popups.ColorChange);
    },

    async handlePlay(gameId: number,card: CardSpecs, cardIndex: number) {
      if (gameId === -1) return;
      this.closePopup(Popups.Play);
      if(card.type === Type.Wild || card.type === Type.WildDrawFour)
      {
        await this.openPopup(Popups.ColorChange)
        await api.play(gameId,cardIndex,this.colorSelected)
      }
      else
      {
        await api.play(gameId, cardIndex);
      }
    },

    async handleDraw(gameId: number) {
      if (gameId === -1) return;
      await api.play(gameId,-1);
      this.closePopup(Popups.Play);
    },
  },
});