// Words sourced from: https://cs.stanford.edu/~knuth/sgb-words.txt

import fs from 'node:fs';
import {EOL} from 'node:os';

const LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'X',
  'Y',
  'Z',
];

// Reads the file of words, and generates a mapping between each word and all the
// valid words that can be reached by changing a single letter.
function findLinkedWords(): Map<string, string[]> {
  try {
    const words = fs
      .readFileSync('./scripts/five-letter-words.txt', 'utf8')
      .split(EOL)
      .map((word) => word.toUpperCase())
      .slice(0, 3500);
    const wordLinkMapping = new Map<string, string[]>();

    for (const word of words) {
      const wordAsArray = word.split('');
      const linkedWords: string[] = [];

      for (let i = 0; i < wordAsArray.length; i++) {
        for (const LETTER of LETTERS) {
          const updatedWordAsArray = [...wordAsArray];
          updatedWordAsArray[i] = LETTER;
          const updatedWordAsString = updatedWordAsArray.join('');
          if (
            words.includes(updatedWordAsString) &&
            !linkedWords.includes(updatedWordAsString) &&
            updatedWordAsString !== word
          ) {
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

// TODO - consider using an increasingly small subset of the words as difficulty increases
function generateData(
  wordLinkMapping: Map<string, string[]>,
  chainLength: number,
) {
  const validPuzzles = [];
  for (const startWord of wordLinkMapping.keys()) {
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
    const pairs = [...endWords]
      .filter(([_key, value]) => value === chainLength)
      .map(([key, _value]) => ({startWord, endWord: key}));

    if ([...wordLinkMapping.keys()].indexOf(startWord) % 100 === 0) {
      console.log(
        `Generating ${chainLength < 6 ? 'easy' : chainLength < 7 ? 'medium' : 'hard'} data... ${[...wordLinkMapping.keys()].indexOf(startWord)}/${wordLinkMapping.size}`,
      );
    }

    validPuzzles.push(...pairs);
  }

  console.log(
    `${chainLength < 6 ? 'Easy' : chainLength < 7 ? 'Medium' : 'Hard'} data generated successfully! Pairs generated: ${validPuzzles.length}`,
  );
  return validPuzzles;
}

const wordLinkMapping = findLinkedWords();

const easy = generateData(wordLinkMapping, 5);
const medium = generateData(wordLinkMapping, 6);
const hard = generateData(wordLinkMapping, 7);

fs.writeFileSync(
  './scripts/puzzles.json',
  JSON.stringify({easy, medium, hard}),
);
console.log('Generated data written to puzzles.json!');
