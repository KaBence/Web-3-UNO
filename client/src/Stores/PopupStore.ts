import { defineStore } from "pinia";
import {Colors} from "Domain/src/model/Card"


export enum Popups {
    Challenge = "Challenge",
    ChallengeResult = "ChallengeResult",
    ColorChange = "ColorChange",
    Play = "Play",
}

export const usePopupStore = defineStore("popup", {
  state: () => ({
    showChallenge: false,
    showChallengeResult: true,
    showChangeColor: false,
    showPlay: false,

    challengeResult: false

  }),
  actions: {
    closePopup(popup:Popups){
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
            default:
                break;
        }
    },

    handleChallengeTrue() {
      console.log("Challenged"); 
      this.closePopup(Popups.Challenge);
      this.showChallengeResult = true;
      this.handleChallengeResult()
    },

    handleChallengeFalse() {
      console.log("Not challenged");
      this.closePopup(Popups.Challenge);
      this.handleChallengeResult()
    },

    handleChallengeResult() {
      console.log("ChallengResult"); 
      this.challengeResult = true //i guess we should away the challengeWildDrawFour() from Round
    },

    handleChooseColor(color:Colors) { //not sure how we are going to handle it if we need switch or just pass the color
        switch (color) {
            case Colors.Red:
                console.log("Red"); 
                break;
        
            case Colors.Blue:
                console.log("Blue"); 
                break;

            case Colors.Yellow:
                console.log("Yellow"); 
                break;
        
            case Colors.Green:
                console.log("Green"); 
                break;
        
            default:
                break;
        }
        this.closePopup(Popups.ColorChange)
    },

    handlePlay() {
        console.log("Play")
        this.closePopup(Popups.Play)
    },

    handleDraw() {
        console.log("Draw")
        this.closePopup(Popups.Play)
    }
  }
});
