import * as fs from 'node:fs';
import { styleText } from 'node:util';
import process from 'node:process';
import { findLinkedWords } from './find-linked-words.js';

function generateData(
    wordLinkMapping: Map<string, string[]>,
    chainLength: number
) {
    console.log(
        styleText(
            'cyan',
            `Generating ${chainLength < 6 ? 'easy' : chainLength < 7 ? 'medium' : 'hard'} puzzles...`
        )
    );

    const puzzleWords = wordLinkMapping.keys().toArray();
    const validPuzzles = [];
    for (const startWord of puzzleWords) {
        const endWords = new Map<string, number>();

        function findEndWords(word: string, index: number, chain: string[]) {
            const nextChain = [...chain, word];

            if (!endWords.has(word) || endWords.get(word)! > index) {
                endWords.set(word, index);
            }

            for (const linkedWord of wordLinkMapping.get(word)!) {
                if (!nextChain.includes(linkedWord) && index < chainLength) {
                    findEndWords(linkedWord, index + 1, nextChain);
                }
            }
        }

        findEndWords(startWord, 0, []);
        const pairs = endWords
            .entries()
            .filter(([_key, value]) => value === chainLength)
            .map(([key, _value]) => ({ startWord, endWord: key }));

        if (puzzleWords.indexOf(startWord) % 100 === 0) {
            console.log(
                styleText(
                    'yellow',
                    `${chainLength < 6 ? 'Easy' : chainLength < 7 ? 'Medium' : 'Hard'} puzzles generated: ${puzzleWords.indexOf(startWord)}/${puzzleWords.length}`
                )
            );
        }

        validPuzzles.push(...pairs);
    }

    console.log(
        styleText(
            'green',
            `${validPuzzles.length} ${chainLength < 6 ? 'easy' : chainLength < 7 ? 'medium' : 'hard'} puzzles generated successfully!`
        )
    );
    return validPuzzles.toSorted((_a, _b) => 0.5 - Math.random());
}

if (process.argv[1] === import.meta.filename) {
    const wordLinkMapping = findLinkedWords(3500);

    // This script will generate 500k+ puzzles per difficulty - store only 1000 each
    const easy = generateData(wordLinkMapping, 5).slice(0, 1000);
    const medium = generateData(wordLinkMapping, 6).slice(0, 1000);
    const hard = generateData(wordLinkMapping, 7).slice(0, 1000);

    fs.writeFileSync(
        './frontend/static/puzzles.json',
        JSON.stringify({ easy, medium, hard })
    );
    console.log(
        styleText('magenta', 'Puzzles written to frontend/static/puzzles.json!')
    );
}
