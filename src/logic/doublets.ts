import { input } from "@inquirer/prompts";

export async function guess(game: string[], index: number): Promise<void> {
    let valid = false;

    while (!valid) {
        const answer = (await input({ message: '' }));

        const response = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${answer}`);

        if ((await response.json()).entries.length > 0 && getWordDiff(game[index-1], answer.toUpperCase()) === 1) {
            game.splice(index, 0, answer.toUpperCase());
            valid = true;
        } else {
            console.log('Invalid guess, try again!');
        }
    }
}

function getWordDiff(word1: string, word2: string): number {
    const diff = []

    if (word1.length !== word1.length) {
        return 0;
    }

    for (const char of word1.split('')) {
        if (!word2.split('').includes(char)) {
            diff.push(char);
        }
    }

    return diff.length;
}