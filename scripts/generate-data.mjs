// Words sourced from: https://cs.stanford.edu/~knuth/sgb-words.txt

import fs from 'node:fs';
import { EOL } from 'node:os';

function generateData() {
    const words = fs.readFileSync('./scripts/five-letter-words.txt', 'utf-8').split(EOL).map(word => word.toUpperCase());

    console.log(words)
}

generateData();