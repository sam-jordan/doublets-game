import { Status, type Word } from './types';

export function emptyGuesses(guesses: number): Word[] {
    return Array.from({ length: guesses })
        .keys()
        .map(item => ({
            index: item,
            letters: Array.from({ length: 5 }, _ => ' '),
            status: Status.UNCHECKED,
        }))
        .toArray();
}
