import { input } from "@inquirer/prompts";

export async function guess(game: string[], index: number): Promise<void> {
    const answer = await input({ message: '' });

    const response = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${answer}`);

    if ((await response.json()).entries && getWordDiff(game[index-1], answer) === 1) {
        game.splice(index, 0, answer);
    }
}

function getWordDiff(word1: string, word2: string): number {
    const diff = []

    for (const char of word1.split('')) {
        if (!word2.split('').includes(char)) {
            diff.push(char);
        }
    }

    return diff.length;
}