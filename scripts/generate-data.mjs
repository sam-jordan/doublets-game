// Words sourced from: https://cs.stanford.edu/~knuth/sgb-words.txt

import fs from 'node:fs';
import { EOL } from 'node:os';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z']

function findLinkedWords() {
    try {
        const words = fs.readFileSync('./scripts/five-letter-words.txt', 'utf-8').split(EOL).map(word => word.toUpperCase()).slice(0, 3500);
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
            if (words.indexOf(word) % 100 === 0) {
                console.log(`Linking words... ${words.indexOf(word)}/${words.length}`);
            }
        }

        return wordLinkMapping;
    } catch {
        throw new Error('Unable to read the file of words!');
    }
}

function getWordDiff(word1, word2) {
    const diff = []

    if (word1.length !== word2.length) {
        return 0;
    }

    for (const char of word1.split('')) {
        if (!word2.split('').includes(char)) {
            diff.push(char);
        }
    }

    return diff.length;
}

function generateData(wordLinkMapping, chainLength) {
    const validPuzzles = [];
    for (const startWord of wordLinkMapping.keys()) {
        const endWords = new Map();

        function findEndWords(word, index, chain) {
            const nextChain = [...chain, word];

            if (!endWords.has(word) || endWords.get(word) > index) {
                endWords.set(word, index);
            }

            for (const linkedWord of wordLinkMapping.get(word)) {
                if (!nextChain.includes(linkedWord) && index < chainLength) {
                    findEndWords(linkedWord, index + 1, nextChain);
                }
            }
        }

        findEndWords(startWord, 0, []);
        const pairs = Array.from(endWords).filter(([key, value]) => value === chainLength).map(([key, value]) => ({ startWord, endWord: key }));

        if (Array.from(wordLinkMapping.keys()).indexOf(startWord) % 100 === 0) {
            console.log(`Generating ${chainLength < 6 ? 'easy' : (chainLength < 7 ? 'medium' : 'hard')} data... ${Array.from(wordLinkMapping.keys()).indexOf(startWord)}/${wordLinkMapping.size}`);
        }

        validPuzzles.push(...pairs);
    }

    console.log(`${chainLength < 6 ? 'Easy' : (chainLength < 7 ? 'Medium' : 'Hard')} data generated successfully! Pairs generated: ${validPuzzles.length}`);
    return validPuzzles;
}

const wordLinkMapping = findLinkedWords();

const easy = generateData(wordLinkMapping, 5);
const medium = generateData(wordLinkMapping, 6);
const hard = generateData(wordLinkMapping, 7);

fs.writeFileSync('./scripts/puzzles.json', JSON.stringify({ easy, medium, hard }));
console.log('Generated data written to puzzles.json!');