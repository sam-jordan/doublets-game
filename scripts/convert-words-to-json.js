// Words sourced from: https://cs.stanford.edu/~knuth/sgb-words.txt

import fs from 'node:fs';
import { EOL } from 'node:os';

const words = fs
    .readFileSync('./scripts/five-letter-words.txt', 'utf8')
    .split(EOL)
    .map(word => word.toUpperCase())
    .slice(0, 3500);

fs.writeFileSync('./static/allowed-words.json', JSON.stringify({ words }));

console.log('Words written to json!');
