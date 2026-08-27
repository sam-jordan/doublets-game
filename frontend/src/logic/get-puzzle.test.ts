import { afterEach, describe, expect, it, vi } from 'vitest';
import { type Difficulties, type Puzzle } from './types';
import { getPuzzle } from './get-puzzle';

describe('getPuzzle', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    const test: Array<{ difficulty: Difficulties; expected: Puzzle }> = [
        {
            difficulty: 'easy',
            expected: { index: 0, startWord: 'TAPED', endWord: 'DOVES' },
        },
        {
            difficulty: 'medium',
            expected: { index: 0, startWord: 'BEVEL', endWord: 'TOWED' },
        },
        {
            difficulty: 'hard',
            expected: { index: 0, startWord: 'GODLY', endWord: 'FISTS' },
        },
    ];

    it.each(test)(
        'Return the correct puzzle per difficulty',
        ({ difficulty, expected }) => {
            vi.useFakeTimers().setSystemTime('2026-08-01T00:00:00Z');
            expect(getPuzzle(difficulty)).toStrictEqual(expected);
        }
    );

    it('should throw an error for an invalid index', () => {
        vi.useFakeTimers().setSystemTime('2029-08-01T00:00:00Z');
        expect(() => getPuzzle('easy')).toThrowErrorMatchingInlineSnapshot(
            `[DoubletsError: Puzzle does not exist for this date.]`
        );
    });
});
