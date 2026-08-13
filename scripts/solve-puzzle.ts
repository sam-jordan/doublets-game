import { styleText } from 'node:util';
import { findLinkedWords } from './generate-puzzles.js';

function solvePuzzle(puzzle: { startWord: string; endWord: string }) {
    const wordLinkMapping = findLinkedWords();

    const chains: string[][] = [];
    function findSolutions(
        word: string,
        solutionBand: number,
        chain: string[]
    ) {
        const nextChain = [...chain, word];

        if (word === puzzle.endWord) {
            chains.push(nextChain);
        }

        for (const linkedWord of wordLinkMapping.get(word)!) {
            if (
                !nextChain.includes(linkedWord) &&
                nextChain.length < solutionBand
            ) {
                findSolutions(linkedWord, solutionBand, nextChain);
            }
        }
    }

    const solutionBands = [5, 10, 15, 20];
    for (const solutionBand of solutionBands) {
        console.log(
            styleText(
                'cyan',
                `Finding solutions shorter than ${solutionBand}...`
            )
        );
        findSolutions(puzzle.startWord, solutionBand, []);

        if (chains.length > 0) {
            break;
        }

        console.log(
            styleText('red', `No solutions shorter than ${solutionBand} found.`)
        );
    }

    // TODO - handle when no solutions shorter than 20 found
    chains.sort((a, b) => b.length - a.length);
    console.log(styleText('green', `Solutions found: ${chains.length}`));
    console.log(
        styleText('magenta', `Shortest solution: ${chains[0].join(' -> ')}`)
    );
}

// TODO - use inquirer to actually prompt for the puzzle
solvePuzzle({ startWord: 'BEACH', endWord: 'HOUSE' });
