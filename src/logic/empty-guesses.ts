import type {Guess} from './types/guess';
import {Status} from './types/status';

export function emptyGuesses(guesses: number): Guess[] {
  return [...Array.from({length: guesses}).keys()].map((item) => ({
    index: item,
    letters: Array.from({length: 5}).fill(' '),
    status: Status.UNCHECKED,
  }));
}
