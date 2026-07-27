import { Difficulties, WordTypes, type Guess } from './types';

export function emptyGuess(index: number): Guess {
    return {
        index,
        letters: Array.from({ length: 5 }, _ => ' '),
        type: WordTypes.GUESS.valueOf(),
        changed: [],
        gameWin: undefined,
    };
}

export function emptyGuesses(): Guess[][] {
    const difficulties = Object.keys(Difficulties)
        .filter(key => !Number.isNaN(Number(key)))
        .map(Number);

    return difficulties.map(difficulty =>
        Array.from({ length: 4 + difficulty })
            .keys()
            .map(item => emptyGuess(item))
            .toArray()
    );
}
