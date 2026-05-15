export type WordStatus = {
    valid: false;
    message: string;
} | { valid: true };

// TODO - evaluate if forcing all guesses to have 1 char difference is good design
export async function validateWord(word: string[], previous: string[]): Promise<WordStatus> {
    if (word.includes(' ')) {
        return { valid: false, message: 'Not enough letters' };
    };

    const response = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${word.join('')}`);
    if (!(await response.json()).entries) {
        return { valid: false, message: 'Not in word list' };
    }

    const diff = []
    for (let i = 0; i < word.length; i++) {
        if (!previous.includes(word[i])) {
            diff.push(i);
        }
    }

    if (diff.length !== 1) {
        return { valid: false, message: 'Too many letters changed' };
    }

    return { valid: true };
}