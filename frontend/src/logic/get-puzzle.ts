import { DateTime } from 'luxon';
import puzzles from '../static/puzzles.json' with { type: 'json' };
import { Difficulties } from './types';

// Get the daily puzzle based on the number of days since 1st August 2026
export function getPuzzle(difficulty: Difficulties) {
    const start = DateTime.fromISO('2026-08-01T00:00:00Z');
    const index = Math.floor(
        Math.abs(start.diffNow().milliseconds / (1000 * 3600 * 24))
    );

    switch (difficulty) {
        case Difficulties.EASY: {
            return puzzles.easy[index];
        }

        case Difficulties.MEDIUM: {
            return puzzles.medium[index];
        }

        case Difficulties.HARD: {
            return puzzles.hard[index];
        }
    }
}
