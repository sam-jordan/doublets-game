import { WordTypes, type Guess } from './types';

export function emptyGuesses(guesses: number): Guess[] {
    return Array.from({ length: guesses })
        .keys()
        .map(item => ({
            index: item,
            letters: Array.from({ length: 5 }, _ => ' '),
            type: WordTypes.GUESS.valueOf(),
            changed: [],
        }))
        .toArray();
}
