import { ShuffleBuilder } from "../../__test__/utils/shuffling";
import { Player} from "./Player";
import { Round } from "./Round";

class RoundFactory {
    createRoundFromMemento(): Round {
        throw new Error("Method not implemented.");
    }

    createMementoFromRound(round: Round): any {
        throw new Error("Method not implemented.");
    }
}