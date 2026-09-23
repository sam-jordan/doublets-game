// Words sourced from: https://cs.stanford.edu/~knuth/sgb-words.txt

import { styleText } from 'node:util';
import { EOL } from 'node:os';
import * as fs from 'node:fs';
import { md5 } from 'js-md5';
import { linkedWordsSchema } from '../shared/types.js';

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

        // Generate a hash of the source words
        const signature = md5(JSON.stringify(words));
        try {
            console.log(
                styleText(
                    'cyan',
                    'Attempting to read word link mapping from file...'
                )
            );

            // Attempt to read the mapping from the intermediate file
            const fromJson = linkedWordsSchema.parse(
                JSON.parse(
                    fs.readFileSync('./scripts/linked-words.json', 'utf8')
                )
            );

            console.log(
                styleText(
                    'cyan',
                    'Mapping read from file, checking if update required...'
                )
            );

            // Return the mapping on file if source has not changed from the one that generated it
            if (fromJson.signature === signature) {
                console.log(styleText('green', 'No mapping update required!'));
                return new Map(Object.entries(fromJson.records));
            }

            console.log(styleText('cyan', 'Mapping update required!'));
        } catch {
            console.log(styleText('red', 'Failed to read mapping from file.'));
        }

        const wordLinkMapping = new Map<string, string[]>();
        console.log(styleText('cyan', 'Linking words...'));

        for (const word of words) {
            const linkedWords: string[] = [];

            // For every word: test all possible words that can be created by changing one letter
            // If they are valid, add them to the mapping (if they are not already present)
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

        // Write the newly generated mapping to file for future use
        console.log(styleText('cyan', 'Writing mapping to file...'));
        fs.writeFileSync(
            './scripts/linked-words.json',
            JSON.stringify({
                signature,
                records: Object.fromEntries(wordLinkMapping),
            })
        );
        console.log(styleText('green', 'Writing mapping to file complete!'));

        return wordLinkMapping;
    } catch {
        throw new Error(
            styleText('red', 'An error ocurred when generating the word links!')
        );
    }
}
