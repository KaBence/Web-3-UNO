import { defineStore } from "pinia";
import { Colors, Type } from "Domain/src/model/Card";
import * as api from "@/model/api";
import type { CardSpecs } from "@/model/Specs";

export enum Popups {
  Challenge = "Challenge",
  ChallengeResult = "ChallengeResult",
  ColorChange = "ColorChange",
  Play = "Play",
}

export const usePopupStore = defineStore("popup", {
  state: () => ({
    showChallenge: false,
    showChallengeResult: false,
    showChangeColor: false,
    showPlay: false,
    challengeResult: false,
    colorSelected: "",
    _popupResolve: undefined as undefined | (() => void),
  }),

  actions: {
    openPopup(popup: Popups, result?: boolean) {
      switch (popup) {
        case Popups.Challenge:
          this.showChallenge = true;
          break;
        case Popups.ChallengeResult:
          this.challengeResult = result!;
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

    async handleChallengeTrue(gameId: number) {
      if (gameId === -1) return;
      const result = await api.challengeDraw4(gameId, true);
      this.closePopup(Popups.Challenge);
      this.openPopup(Popups.ChallengeResult, result);
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