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

function readLinkedWords() {
    try {
        const wordLinkMapping = new Map(Object.entries(JSON.parse(fs.readFileSync('./scripts/linked-words.json', 'utf-8'))));
        console.log('Linked words found...');
        return wordLinkMapping;
    } catch {
        const wordLinkMapping = findLinkedWords();
        const wordLinkMappingAsJSON = JSON.stringify(Object.fromEntries(wordLinkMapping));
        fs.writeFileSync('./scripts/linked-words.json', wordLinkMappingAsJSON);
        console.log('Linked words written to disk...');
        return wordLinkMapping;
    }
}

function getWordDiff(word1, word2) {
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

function generateData() {
    const wordLinkMapping = readLinkedWords();

    const validPuzzles = [];
    for (const word of wordLinkMapping.keys()) {
        const exploredWords = [];
        const chainedWords = [];

        function findChainedWords(word, index) {
            exploredWords.push(word);

            if (index === 5) {
                chainedWords.push(word);
            }

            for (const linkedWord of wordLinkMapping.get(word)) {
                if (!exploredWords.includes(linkedWord) && getWordDiff(exploredWords[0], linkedWord) === index + 1) {
                    findChainedWords(linkedWord, index+1);
                }
            }
        }

        findChainedWords(word, 0);
        const validPairs = chainedWords.map(chainedWord => [word, chainedWord]);
        validPuzzles.push(...validPairs)
    }

    return validPuzzles;
}

generateData();