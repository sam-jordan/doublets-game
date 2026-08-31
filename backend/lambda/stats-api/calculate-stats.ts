import { Duration } from 'luxon';
import { type Puzzle, type Stats } from './types.js';

export function calculateStats(puzzles: Puzzle[]): Stats {
    const uniqueWords = new Set();
    let totalGuesses = 0;
    const totalDuration = Duration.fromMillis(0);

    puzzles.map(puzzle => {
        if (!puzzle.attempted) {
            return;
        }

        totalGuesses += puzzle.guesses.length;
        totalDuration.plus(puzzle.solveTime);

        return puzzle.guesses.map(guess => uniqueWords.add(guess));
    });

    const solved = puzzles.filter(puzzle => puzzle.attempted).length;

    return {
        puzzlesAttempted: puzzles.length,
        puzzlesSolved: solved,
        wordsUsed: uniqueWords.size,
        averageTime: Duration.fromMillis(
            totalDuration.as('milliseconds') / solved
        ),
        averageGuesses: totalGuesses / solved,
    };
}
