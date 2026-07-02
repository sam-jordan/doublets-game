import {
    dictionaryWord,
    type Guess,
    type Puzzle,
    type Validation,
} from './types';

async function validateWord(
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

    // FIX - this one is returning false positives
    if (parsed.error) {
        return { valid: false, message: 'Not in word list' };
    }

    return { valid: true };
}

export function getChanged(word: string[], previous: string[]) {
    const diff = [];
    for (const [i, element] of word.entries()) {
        if (element === ' ') {
            continue;
        }

        if (previous[i] !== element) {
            diff.push(i);
        }
    }

    return diff;
}

export async function validateSolution(
    guesses: Guess[],
    puzzle: Puzzle
): Promise<Validation> {
    for (const guess of guesses) {
        // eslint-disable-next-line no-await-in-loop
        const result = await validateWord(guess.letters, puzzle);

        if (!result.valid) {
            return {
                valid: false,
                message: `Guess ${guess.index + 1}: ${result.message}`,
            };
        }

        const changed = getChanged(
            guess.letters,
            guess.index === 0
                ? puzzle.startWord.split('')
                : guesses[guess.index - 1].letters
        );

        if (changed.length !== 1) {
            return {
                valid: false,
                message: `Guess ${guess.index + 1}: Change only one letter between guesses!`,
            };
        }
    }

    return { valid: true };
}
