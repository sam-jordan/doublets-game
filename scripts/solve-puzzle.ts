#!/usr/bin/env node

import { styleText } from 'node:util';
import process from 'node:process';
import { input } from '@inquirer/prompts';
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

        if (chains.length > 50) {
            return;
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

    if (chains.length > 0) {
        chains.sort((a, b) => b.length - a.length);
        console.log(styleText('green', `Solutions found: ${chains.length}`));
        console.log(
            styleText('magenta', `Shortest solution: ${chains[0].join(' -> ')}`)
        );
    } else {
        console.log(
            styleText(
                'red',
                'Make sure the start and end words have been entered correctly'
            )
        );
    }
}

try {
    const start = await input({
        message: styleText('magenta', 'Enter the start word: '),
    });
    const end = await input({
        message: styleText('magenta', 'Enter the end word: '),
    });

    solvePuzzle({ startWord: start.toUpperCase(), endWord: end.toUpperCase() });
} catch (error) {
    if (error instanceof Error) {
        console.error(
            styleText(
                'red',
                `An error occurred when solving this puzzle: ${error.message}`
            )
        );
    }

    process.exit(1);
}
