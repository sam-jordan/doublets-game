import allowed from '../static/allowed-words.json' with { type: 'json' };
import { type Guess, type Puzzle, type Validation } from './types';

export function validateWord(
    word: string[],
    index: number,
    puzzle: Puzzle
): Validation {
    if (word.includes(' ')) {
        return { valid: false, message: 'Not enough letters', index };
    }

    if (Object.values(puzzle).includes(word.join(''))) {
        return {
            valid: false,
            message: 'Do not guess the start or end words!',
            index,
        };
    }

    if (!allowed.words.includes(word.join(''))) {
        return { valid: false, message: 'Not in word list', index };
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

export function validateSolution(guesses: Guess[], puzzle: Puzzle): Validation {
    for (const guess of guesses) {
        const result = validateWord(guess.letters, guess.index, puzzle);

        if (!result.valid) {
            return {
                valid: false,
                message: `Guess ${guess.index + 1}: ${result.message}`,
                index: result.index,
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
                index: guess.index,
            };
        }

        if (guess.index === guesses.length - 1) {
            const finalChanged = getChanged(
                puzzle.endWord.split(''),
                guess.letters
            );

            if (finalChanged.length !== 1) {
                return {
                    valid: false,
                    message: `Guess ${guess.index + 1}: Does not connect to the end word!`,
                    index: guess.index,
                };
            }
        }
    }

    return { valid: true };
}
