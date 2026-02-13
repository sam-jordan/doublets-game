// Words sourced from: https://cs.stanford.edu/~knuth/sgb-words.txt

import fs from 'node:fs';
import { EOL } from 'node:os';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z']

function findLinkedWords() {
    const words = fs.readFileSync('./scripts/five-letter-words.txt', 'utf-8').split(EOL).map(word => word.toUpperCase());
    const wordLinkMapping = new Map();

    for (const word of words) {
        const wordAsArray = word.split('');
        const linkedWords = [];
        
        for (let i = 0; i < wordAsArray.length; i++) {
            for (let j = 0; j < LETTERS.length; j++) {
                const updatedWordAsArray = [...wordAsArray]
                updatedWordAsArray[i] = LETTERS[j];
                const updatedWordAsString = updatedWordAsArray.join('');
                if (words.includes(updatedWordAsString) && !linkedWords.includes(updatedWordAsString) && updatedWordAsString !== word) {
                    linkedWords.push(updatedWordAsString);
                }
            }
        }

        wordLinkMapping.set(word, linkedWords);
        console.log(`${words.indexOf(word)} / ${words.length}`)
    }

    return wordLinkMapping;
}

function generateData() {
    try {
        fs.readFileSync('./scripts/linked-words.json');
        console.log('Linked words found...');
    } catch {
        const wordLinkMapping = findLinkedWords();
        const wordLinkMappingAsJSON = JSON.stringify(Object.fromEntries(wordLinkMapping));
        fs.writeFileSync('./scripts/linked-words.json', wordLinkMappingAsJSON);
        console.log('Linked words written to disk...');
    }
}

generateData();