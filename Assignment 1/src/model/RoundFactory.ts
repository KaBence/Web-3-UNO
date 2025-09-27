import { ShuffleBuilder } from "../../__test__/utils/shuffling";
import { Player} from "./Player";
import { Round } from "./RoundFIlip";

class RoundFactory {
    createRound(players: Player[], dealer: number, shuffler: ShuffleBuilder, cardsPerPlayer: number): Round { //why shafller
        return new Round(players, dealer, shuffler, cardsPerPlayer);
    }

    createRoundFromMemento(): Round {
        throw new Error("Method not implemented.");
    }

    createMementoFromRound(round: Round): any {
        throw new Error("Method not implemented.");
    }
}