export type WordStatus = {
    valid: boolean;
    changed: number[]
}

// TODO - evaluate if forcing all guesses to have 1 char difference is good design
export async function validateWord(word: string[], previous: string[]): Promise<WordStatus> {
    let valid = false;
    const response = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${word.join('')}`);
    if ((await response.json()).entries) {
        valid = true;
    }

    const diff = []
    for (let i = 0; i < word.length; i++) {
        if (!previous.includes(word[i])) {
            diff.push(i);
        }
    }

    return { valid, changed: diff };
}