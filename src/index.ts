import { guess } from './doublets.js';

async function main() {
    const game = ['BEST', 'GOAL'];

    console.log('-'.repeat(32));
    console.log(`${game[0]} => ${game[1]}`);
    
    for (let i = 1; i < game[0].length; i++) {
        console.log('-'.repeat(32));
        await guess(game, i);
    }

    console.log(game);
}

main();