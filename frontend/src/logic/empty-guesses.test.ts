import { describe, expect, it } from 'vitest';
import { emptyGuess, emptyGuesses } from './empty-guesses';

describe('emptyGuess', () => {
    it('should return an empty guess object', () => {
        expect(emptyGuess(1)).toStrictEqual({
            index: 1,
            letters: [' ', ' ', ' ', ' ', ' '],
            type: 'guess',
            changed: [],
            gameWin: undefined,
        });
    });
});

describe('emptyGuesses', () => {
    it('should return an array of empty guesses for each difficulty', () => {
        const empties = emptyGuesses();

        expect(empties.length).toBe(3);
        expect(empties).toMatchInlineSnapshot(`
          [
            [
              {
                "changed": [],
                "gameWin": undefined,
                "index": 0,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 1,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 2,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 3,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
            ],
            [
              {
                "changed": [],
                "gameWin": undefined,
                "index": 0,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 1,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 2,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 3,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 4,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
            ],
            [
              {
                "changed": [],
                "gameWin": undefined,
                "index": 0,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 1,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 2,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 3,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 4,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
              {
                "changed": [],
                "gameWin": undefined,
                "index": 5,
                "letters": [
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                ],
                "type": "guess",
              },
            ],
          ]
        `);
    });
});
