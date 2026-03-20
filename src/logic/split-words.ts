export default function splitWords(letters: string[], size: number) {
    const result = [];

    for (let i = 0; i < letters.length; i += size) {
        result.push(letters.slice(i, i + size));
    }

    return result;
}