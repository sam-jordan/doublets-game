// Words sourced from: https://cs.stanford.edu/~knuth/sgb-words.txt

import { styleText } from 'node:util';
import { EOL } from 'node:os';
import * as fs from 'node:fs';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Reads the file of words, and generates a mapping between each word and all the
// valid words that can be reached by changing a single letter.
export function findLinkedWords(wordCount?: number): Map<string, string[]> {
    try {
        const fromFile = fs
            .readFileSync('./scripts/five-letter-words.txt', 'utf8')
            .split(EOL)
            .map(word => word.toUpperCase());

        const words =
            wordCount === undefined ? fromFile : fromFile.slice(0, wordCount);
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
        // TODO - consider writing this to a file for faster use
        return wordLinkMapping;
    } catch {
        throw new Error(styleText('red', 'Unable to read the file of words!'));
    }
}
