import type { Puzzle } from './get-puzzle';
import type { Guess } from './types/guess';
import { Status } from './types/status';

type Validation =
    | {
          valid: false;
          message: string;
      }
    | { valid: true };

export async function validateWord(
    word: string[],
    puzzle: Puzzle
): Promise<Validation> {
    if (word.includes(' ')) {
        return { valid: false, message: 'Not enough letters' };
    }

    if (Object.values(puzzle).includes(word.join(''))) {
        return {
            valid: false,
            message: 'Do not guess the start or end words!',
        };
    }

    const response = await fetch(
        `https://freedictionaryapi.com/api/v1/entries/en/${word.join('')}`
    );
    if (!(await response.json()).entries) {
        return { valid: false, message: 'Not in word list' };
    }

    return { valid: true };
}

export async function validateSolution(
    guesses: Guess[],
    puzzle: Puzzle
): Promise<Validation> {
    const solution = [
        {
            index: 0,
            letters: puzzle.startWord.split(''),
            status: Status.CHECKED,
        },
        ...guesses.map(guess => ({ ...guess, index: guess.index + 1 })),
        {
            index: guesses.length + 1,
            letters: puzzle.endWord.split(''),
            status: Status.CHECKED,
        },
    ];

    for (const word of solution) {
        if (word.index === 0) {
            continue;
        }

        const wordValidation = await validateWord(word.letters, puzzle);
        if (!wordValidation.valid) {
            return wordValidation;
        }

        const diff = [];
        for (let i = 0; i < word.letters.length; i++) {
            if (guesses[word.index - 1].letters[i] !== word.letters[i]) {
                diff.push(word.letters[i]);
            }
        }

        if (diff.length !== 1) {
            return {
                valid: false,
                message: 'Change only one letter between guesses!',
            };
        }
    }

    return { valid: true };
}
