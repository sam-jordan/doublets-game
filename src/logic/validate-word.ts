import type { Puzzle } from "./get-puzzle";

export type WordStatus = {
    valid: false;
    message: string;
} | { valid: true };

// TODO - evaluate if actually forcing the guesses to have 1 char difference is good design
export async function validateWord(word: string[], previous: string[], puzzle: Puzzle): Promise<WordStatus> {
    if (word.includes(' ')) {
        return { valid: false, message: 'Not enough letters' };
    };

    if (Object.values(puzzle).includes(word.join(''))) {
        return { valid: false, message: 'Do not guess the start or end words!' };
    }

    const response = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${word.join('')}`);
    if (!(await response.json()).entries) {
        return { valid: false, message: 'Not in word list' };
    }

    // TODO - refactor this to check character positions
    const diff = []
    for (let i = 0; i < word.length; i++) {
        if (!previous.includes(word[i])) {
            diff.push(i);
        }
    }

    if (diff.length !== 1) {
        return { valid: false, message: 'Change only one letter between guesses!' };
    }

    return { valid: true };
}