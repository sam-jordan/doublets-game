import { Duration } from 'luxon';
import z from 'zod';
import { type JWT } from 'aws-amplify/auth';

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulties = (typeof DIFFICULTIES)[number];

export type WordTypes = 'fixed' | 'guess';

export type Puzzle = { index: number; startWord: string; endWord: string };

type Word = {
    index: number;
    letters: string[];
    gameWin?: number | undefined;
};

export type Guess = Word & {
    type: 'guess';
    changed: number[];
};

const guessSchema = z.object({
    index: z.number(),
    letters: z.array(z.string()),
    gameWin: z.number().optional(),
    type: z.literal('guess'),
    changed: z.array(z.number()),
});

type Fixed = Word & {
    type: 'fixed';
};

type Animations = {
    lastTyped: number | undefined;
    useShake: number | undefined;
    useJump: number | undefined;
    setUseJump: React.Dispatch<React.SetStateAction<number | undefined>>;
};

type GuessProps = Guess & Animations & UseGameState;

export type RowProps = Fixed | GuessProps;

export type Validation =
    | {
          valid: false;
          message: string;
          index: number;
      }
    | { valid: true };

export class DoubletsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DoubletsError';
    }
}

export type GameState = {
    guesses: Record<Difficulties, Guess[]>;
    currentGuess: number;
    difficulty: Difficulties;
    solved: Record<Difficulties, number | undefined>;
    timers: Record<Difficulties, Duration>;
};

export const gameStateSchema = z.object({
    guesses: z.record(z.enum(DIFFICULTIES), z.array(guessSchema)),
    currentGuess: z.number(),
    difficulty: z.enum(DIFFICULTIES),
    solved: z.record(
        z.enum(DIFFICULTIES),
        z
            .number()
            .nullable()
            .transform(value => value ?? undefined)
    ),
    timers: z.record(
        z.enum(DIFFICULTIES),
        z.string().transform(value => Duration.fromISO(value))
    ),
});

export type UseGameState = {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
};

export const viteEnvironment = z.object({
    VITE_USER_POOL_ID: z.string(),
    VITE_USER_POOL_CLIENT_ID: z.string(),
    VITE_API_URL: z.string(),
});

export type LoginDetails = {
    username: string;
    password: string;
    confirm?: string;
};

export type SignInOptions = {
    username: string;
    password: string;
    submitted: boolean;
};

export type LoadingProps = {
    size: string;
};

export type CallApiOptions = {
    endpoint: {
        path: string;
        schema: z.ZodType;
    };
    method: 'GET' | 'POST' | 'PUT';
};

export class StatsApiError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

const statsPerDifficultySchema = z.object({
    puzzlesAttempted: z.number(),
    puzzlesSolved: z.number(),
    wordsUsed: z.number(),
    averageTime: z.string().transform(value => Duration.fromISO(value)),
    averageGuesses: z.number(),
});

export const statsSchema = z.object({
    easy: statsPerDifficultySchema,
    medium: statsPerDifficultySchema,
    hard: statsPerDifficultySchema,
});

export type Stats = z.infer<typeof statsSchema>;

export const sessionSchema = z.object({
    tokens: z.object({
        accessToken: z.custom<JWT>(),
        idToken: z.custom<JWT>().optional(),
    }),
});
