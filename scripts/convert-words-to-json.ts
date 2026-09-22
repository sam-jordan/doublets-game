#!/usr/bin/env node

// Words sourced from: https://cs.stanford.edu/~knuth/sgb-words.txt

import * as fs from 'node:fs';
import { EOL } from 'node:os';
import { styleText } from 'node:util';
import process from 'node:process';

function convertWordsToJson() {
    const words = fs
        .readFileSync('./scripts/five-letter-words.txt', 'utf8')
        .split(EOL)
        .map(word => word.toUpperCase());

    fs.writeFileSync(
        './frontend/src/static/allowed-words.json',
        JSON.stringify({ words })
    );

    console.log(styleText('green', 'Words written to JSON!'));
}

try {
    convertWordsToJson();
    process.exit(0);
} catch (error) {
    console.error(error);
    process.exit(1);
}
