/* eslint-disable unicorn/max-nested-calls -- prefer to not split Zod schemas */

import { Duration } from 'luxon';
import z from 'zod';

export const puzzleSchema = z.discriminatedUnion('attempted', [
    z.object({ attempted: z.literal(false) }),
    z.object({
        attempted: z.literal(true),
        solveTime: z.string().transform(value => Duration.fromISO(value)),
        guesses: z.array(z.string()),
    }),
]);

export type Puzzle = z.infer<typeof puzzleSchema>;

export type Stats = {
    puzzlesAttempted: number;
    puzzlesSolved: number;
    wordsUsed: number;
    averageTime: Duration;
    averageGuesses: number;
};
