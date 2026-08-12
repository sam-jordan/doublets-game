import { describe, expect, it } from 'vitest';
import { getChanged, validateWord } from './validators';

describe('validateWord', () => {
    it('should invalidate a word with empty letters', () => {
        const word = ['B', 'R', 'A', 'T', ' '];
        const validation = validateWord(word, 0, {
            startWord: 'TRIBE',
            endWord: 'QUEST',
        });

        expect.assert(!validation.valid);
        expect(validation.message).toBe('Not enough letters');
    });

    it('should invalidate a word that is part of the puzzle', () => {
        const word = ['M', 'I', 'L', 'E', 'S'];
        const validation = validateWord(word, 0, {
            startWord: 'MILES',
            endWord: 'DAVIS',
        });

        expect.assert(!validation.valid);
        expect(validation.message).toBe('Do not guess the start or end words!');
    });

    it('should invalidate nonexistant words', () => {
        const word = ['B', 'C', ',', 'N', 'R'];
        const validation = validateWord(word, 0, {
            startWord: 'SQUID',
            endWord: 'SHAME',
        });

        expect.assert(!validation.valid);
        expect(validation.message).toBe('Not in word list');
    });

    it('should allow valid words', () => {
        const word = ['Y', 'O', 'U', 'N', 'G'];
        const validation = validateWord(word, 0, {
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
