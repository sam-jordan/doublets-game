import { Status, type Guess } from './types';

export function emptyGuesses(guesses: number): Guess[] {
    return Array.from({ length: guesses })
        .keys()
        .map(item => ({
            index: item,
            letters: Array.from({ length: 5 }, _ => ' '),
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            status: Status.UNCHECKED as Status.UNCHECKED,
        }))
        .toArray();
}
