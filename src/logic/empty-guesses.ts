import type { Guess } from "./types/guess";
import { Status } from "./types/status";

export function emptyGuesses(guesses: number): Guess[] {
    return [...Array(guesses).keys()].map(item => ({
        index: item,
        letters: new Array(5).fill(' '),
        status: Status.UNCHECKED,
    }));
}