import { afterEach, describe, expect, it, vi } from 'vitest';
import { Difficulties } from './types';
import { getPuzzle } from './get-puzzle';

describe('getPuzzle', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it.each([
        {
            difficulty: Difficulties.EASY,
            expected: { startWord: 'TAPED', endWord: 'DOVES' },
        },
        {
            difficulty: Difficulties.MEDIUM,
            expected: { startWord: 'BEVEL', endWord: 'TOWED' },
        },
        {
            difficulty: Difficulties.HARD,
            expected: { startWord: 'GODLY', endWord: 'FISTS' },
        },
    ])(
        'Return the correct puzzle per difficulty',
        ({ difficulty, expected }) => {
            vi.useFakeTimers().setSystemTime('2026-08-01T00:00:00Z');
            expect(getPuzzle(difficulty)).toStrictEqual(expected);
        }
    );

    it('should throw an error for an invalid index', () => {
        vi.useFakeTimers().setSystemTime('2029-08-01T00:00:00Z');
        expect(() =>
            getPuzzle(Difficulties.EASY)
        ).toThrowErrorMatchingInlineSnapshot(
            `[DoubletsError: Puzzle does not exist for this date.]`
        );
    });
});
