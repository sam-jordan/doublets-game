// Words sourced from: https://cs.stanford.edu/~knuth/sgb-words.txt

import * as fs from 'node:fs';
import { EOL } from 'node:os';
import { styleText } from 'node:util';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Reads the file of words, and generates a mapping between each word and all the
// valid words that can be reached by changing a single letter.
function findLinkedWords(): Map<string, string[]> {
    try {
        const words = fs
            .readFileSync('./scripts/five-letter-words.txt', 'utf8')
            .split(EOL)
            .map(word => word.toUpperCase())
            .slice(0, 3500);
        const wordLinkMapping = new Map<string, string[]>();

        console.log(styleText('cyan', 'Linking words...'));
        for (const word of words) {
            const linkedWords: string[] = [];

            for (let i = 0; i < word.length; i++) {
                for (const letter of LETTERS) {
                    const updatedWord = word
                        .split('')
                        .map((char, index) => (index === i ? letter : char))
                        .join('');

                    if (
                        words.includes(updatedWord) &&
                        !linkedWords.includes(updatedWord) &&
                        updatedWord !== word
                    ) {
                        linkedWords.push(updatedWord);
                    }
                }
            }

            wordLinkMapping.set(word, linkedWords);
            if (words.indexOf(word) % 100 === 0) {
                console.log(
                    styleText(
                        'yellow',
                        `Linked: ${words.indexOf(word)}/${words.length}`
                    )
                );
            }
        }

        console.log(styleText('green', 'Linking words complete!'));
        return wordLinkMapping;
    } catch {
        throw new Error(styleText('red', 'Unable to read the file of words!'));
    }
}

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

    // IDEA - use a larger subset of both puzzle words and chain words for higher difficulties
    const puzzleWords = wordLinkMapping.keys().toArray().slice(0, 1000);
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

const wordLinkMapping = findLinkedWords();

// IDEA - probably want to take a small subset of the puzzles for upload
const easy = generateData(wordLinkMapping, 5);
const medium = generateData(wordLinkMapping, 6);
const hard = generateData(wordLinkMapping, 7);

fs.writeFileSync(
    './frontend/static/puzzles.json',
    JSON.stringify({ easy, medium, hard })
);
console.log(styleText('magenta', 'Puzzles written to static/puzzles.json!'));
