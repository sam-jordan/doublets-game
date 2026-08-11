import { describe, expect, it } from 'vitest';
import { validateWord } from './validators';

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
