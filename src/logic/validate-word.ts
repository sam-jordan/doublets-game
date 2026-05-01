export type WordStatus = {
    valid: boolean;
    changed: string[]
}

export async function validateWord(word: string[], previous: string[]): Promise<WordStatus> {
    let valid = false;
    const response = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${word.join('')}`);
    if ((await response.json()).entries) {
        valid = true;
    }

    const diff = []
    for (const char of word) {
        if (!previous.includes(char)) {
            diff.push(char);
        }
    }

    return { valid, changed: diff };
}