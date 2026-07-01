import { z } from 'zod';
import { Status, type Word, type Puzzle } from './types';

type Validation =
    | {
          valid: false;
          message: string;
      }
    | { valid: true };

const dictionaryWord = z.object({
    word: z.string(),
    entries: z.array(
        z.object({
            language: z.object({
                code: z.string(),
                name: z.string(),
            }),
        })
    ),
});

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

    const parsed = dictionaryWord.safeParse(await response.json());

    if (parsed.error) {
        return { valid: false, message: 'Not in word list' };
    }

    return { valid: true };
}

export async function validateSolution(
    guesses: Word[],
    puzzle: Puzzle
): Promise<Validation> {
    const solution = [
        {
            index: 0,
            letters: puzzle.startWord.split(''),
            status: Status.FIXED,
        },
        ...guesses.map(guess => ({ ...guess, index: guess.index + 1 })),
        {
            index: guesses.length + 1,
            letters: puzzle.endWord.split(''),
            status: Status.FIXED,
        },
    ];

    for (const word of solution) {
        if (word.index === 0) {
            continue;
        }

        // eslint-disable-next-line no-await-in-loop
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
