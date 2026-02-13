import { input } from '@inquirer/prompts';

const game = ['BEST', 'GOAL'];

async function guess() {
    const answer = await input({ message: '' });

    const response = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${answer}`);

    if ((await response.json()).entries) {
        game.push(answer);
    }
}

function main() {
    console.log('-'.repeat(32));
    console.log(`${game[0]} => ${game[1]}`);
    console.log('-'.repeat(32));
    guess();
}

main();