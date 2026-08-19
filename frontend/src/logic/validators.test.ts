import { describe, expect, it } from 'vitest';
import { getChanged, validateSolution, validateWord } from './validators';
import { WordTypes } from './types';

describe('validateWord', () => {
    it('should invalidate a word with empty letters', () => {
        const word = ['B', 'R', 'A', 'T', ' '];
        const validation = validateWord(word, 0, {
            index: 0,
            startWord: 'TRIBE',
            endWord: 'QUEST',
        });

        expect.assert(!validation.valid);
        expect(validation.message).toBe('Not enough letters');
    });

    it('should invalidate a word that is part of the puzzle', () => {
        const word = ['M', 'I', 'L', 'E', 'S'];
        const validation = validateWord(word, 0, {
            index: 0,
            startWord: 'MILES',
            endWord: 'DAVIS',
        });

        expect.assert(!validation.valid);
        expect(validation.message).toBe('Do not guess the start or end words!');
    });

    it('should invalidate nonexistant words', () => {
        const word = ['B', 'C', ',', 'N', 'R'];
        const validation = validateWord(word, 0, {
            index: 0,
            startWord: 'SQUID',
            endWord: 'SHAME',
        });

        expect.assert(!validation.valid);
        expect(validation.message).toBe('Not in word list');
    });

    it('should allow valid words', () => {
        const word = ['Y', 'O', 'U', 'N', 'G'];
        const validation = validateWord(word, 0, {
            index: 0,
            startWord: 'DYLAN',
            endWord: 'SIMON',
        });

        expect(validation.valid);
    });
});

describe('getChanged', () => {
    it('should return an empty array for the same word repeated', () => {
        expect(
            getChanged(['B', 'O', 'W', 'I', 'E'], ['B', 'O', 'W', 'I', 'E'])
        ).toHaveLength(0);
    });

    it('should return the correct changed indices', () => {
        expect(
            getChanged(['G', 'E', 'E', 'S', 'E'], ['G', 'O', 'O', 'S', 'E'])
        ).toStrictEqual([1, 2]);
    });

    it('should skip over empty spaces', () => {
        expect(
            getChanged(['K', 'I', 'N', 'G', ' '], ['K', 'R', 'U', 'L', 'E'])
        ).toStrictEqual([1, 2, 3]);
    });

    it('should return every index for two completely different words', () => {
        expect(
            getChanged(['M', 'O', 'U', 'N', 'T'], ['E', 'E', 'R', 'I', 'E'])
        ).toStrictEqual([0, 1, 2, 3, 4]);
    });
});

describe('validateSolution', () => {
    it('should highlight the index of the first invalid word', () => {
        const puzzle = { index: 0, startWord: 'DEATH', endWord: 'GRIPS' };
        const guesses = [
            {
                index: 0,
                letters: ['A', 'P', 'H', 'E', 'X'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
            {
                index: 1,
                letters: ['T', 'W', 'I', 'N', ' '],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
        ];

        const validation = validateSolution(guesses, puzzle);

        expect.assert(!validation.valid);
        expect(validation.index).toBe(0);
        expect(validation.message).toBe('Guess 1: Not in word list');
    });

    it('should invalidate when too many letters have been changed', () => {
        const puzzle = { index: 0, startWord: 'WHITE', endWord: 'SNAKE' };
        const guesses = [
            {
                index: 0,
                letters: ['T', 'I', 'T', 'L', 'E'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
            {
                index: 1,
                letters: ['F', 'I', 'G', 'H', 'T'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
        ];

        const validation = validateSolution(guesses, puzzle);

        expect.assert(!validation.valid);
        expect(validation.index).toBe(0);
        expect(validation.message).toBe(
            'Guess 1: Change only one letter between guesses!'
        );
    });

    it('should invalidate when a solution does not connect up', () => {
        const puzzle = { index: 0, startWord: 'FRANK', endWord: 'OCEAN' };
        const guesses = [
            {
                index: 0,
                letters: ['P', 'R', 'A', 'N', 'K'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
        ];

        const validation = validateSolution(guesses, puzzle);

        expect.assert(!validation.valid);
        expect(validation.index).toBe(0);
        expect(validation.message).toBe(
            'Guess 1: Does not connect to the end word!'
        );
    });

    it('should allow a valid solution', () => {
        const puzzle = { index: 0, startWord: 'BEACH', endWord: 'HOUSE' };
        const guesses = [
            {
                index: 0,
                letters: ['L', 'E', 'A', 'C', 'H'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
            {
                index: 1,
                letters: ['L', 'E', 'A', 'S', 'H'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
            {
                index: 2,
                letters: ['L', 'E', 'A', 'S', 'T'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
            {
                index: 3,
                letters: ['B', 'E', 'A', 'S', 'T'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
            {
                index: 4,
                letters: ['B', 'O', 'A', 'S', 'T'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
            {
                index: 5,
                letters: ['R', 'O', 'A', 'S', 'T'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
            {
                index: 6,
                letters: ['R', 'O', 'U', 'S', 'T'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
            {
                index: 7,
                letters: ['R', 'O', 'U', 'S', 'E'],
                gameWin: undefined,
                type: WordTypes.GUESS.valueOf(),
                changed: [],
            },
        ];

        const validation = validateSolution(guesses, puzzle);

        expect(validation.valid);
    });
});
