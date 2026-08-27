import { DIFFICULTIES, type Difficulties, type Guess } from './types';

export function emptyGuess(index: number): Guess {
    return {
        index,
        letters: Array.from({ length: 5 }, _ => ' '),
        type: 'guess',
        changed: [],
        gameWin: undefined,
    };
}

export function emptyGuesses(): Record<Difficulties, Guess[]> {
    return Object.fromEntries(
        DIFFICULTIES.map((difficulty, index) => [
            difficulty,
            Array.from({ length: 4 + index })
                .keys()
                .map(item => emptyGuess(item))
                .toArray(),
        ])
    ) as Record<Difficulties, Guess[]>;
}
