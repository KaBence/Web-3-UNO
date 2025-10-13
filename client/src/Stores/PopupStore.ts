import { defineStore } from "pinia";
import { Colors } from "Domain/src/model/Card";

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
    colorSelected: '',

    _popupResolve: null as null | (() => void),
  }),

  actions: {
    openPopup(popup: Popups) {
      switch (popup) {
        case Popups.Challenge:
          this.showChallenge = true;
          break;
        case Popups.ChallengeResult:
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
        this._popupResolve = null;
      }
    },

    handleChallengeTrue() {
      console.log("Challenged");
      this.closePopup(Popups.Challenge);
      this.showChallengeResult = true;
      this.handleChallengeResult();
    },

    handleChallengeFalse() {
      console.log("Not challenged");
      this.closePopup(Popups.Challenge);
      this.handleChallengeResult();
    },

    handleChallengeResult() {
      console.log("ChallengeResult");
      this.challengeResult = true;
    },

    handleChooseColor(color: Colors) {
      this.colorSelected = color.toString();
      this.closePopup(Popups.ColorChange);
    },

    handlePlay() {
      console.log("Play");
      this.closePopup(Popups.Play);
    },

    handleDraw() {
      console.log("Draw");
      this.closePopup(Popups.Play);
    },
  },
});
