import { Duration } from 'luxon';
import z from 'zod';

export const attemptedSchema = z.object({
    attempted: z.boolean(),
    solved: z.literal(false),
});
export const solvedSchema = z.object({
    attempted: z.boolean(),
    solved: z.literal(true),
    solveTime: z.string().transform(value => Duration.fromISO(value)),
    guesses: z.array(z.string()),
});

export const puzzleSchema = z.discriminatedUnion('solved', [
    attemptedSchema,
    solvedSchema,
]);

export type Puzzle = z.infer<typeof puzzleSchema>;

export const puzzleRecordsSchema = z.array(
    z.object({
        username: z.string(),
        puzzle: z.string(),
        puzzleStatus: z.string(),
    })
);

export type Stats = {
    puzzlesAttempted: number;
    puzzlesSolved: number;
    wordsUsed: number;
    averageTime: Duration;
    averageGuesses: number;
};
