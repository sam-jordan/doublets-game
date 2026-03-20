export default function splitWords(letters: string[], size: number) {
    const result = [];

    for (let i = 0; i < letters.length - size; i++) {
        if (i === 0 || (i + 1) % size === 0) {
            result.push(letters.slice(i, i + size));
        }
    }

    return result;
}