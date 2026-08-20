/* eslint-disable @typescript-eslint/no-restricted-types -- need nulls for JSON storage */

import { Duration } from 'luxon';
import z from 'zod';

export enum Difficulties {
    EASY,
    MEDIUM,
    HARD,
}

export enum WordTypes {
    FIXED,
    GUESS,
}

export type Puzzle = { index: number; startWord: string; endWord: string };

type Word = {
    index: number;
    letters: string[];
    gameWin?: number | undefined;
};

export type Guess = Word & {
    type: WordTypes.GUESS;
    changed: number[];
};

const guessSchema = z.object({
    index: z.number(),
    letters: z.array(z.string()),
    gameWin: z.number().optional(),
    type: z.literal(WordTypes.GUESS),
    changed: z.array(z.number()),
});

type Fixed = Word & {
    type: WordTypes.FIXED;
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
    guesses: Guess[][];
    currentGuess: number;
    difficulty: Difficulties;
    solved: Array<number | null>;
    timers: Duration[];
};

export const gameStateSchema = z.object({
    guesses: z.array(z.array(guessSchema)),
    currentGuess: z.number(),
    difficulty: z.enum(Difficulties),
    solved: z.array(z.number().nullable()),
    timers: z.array(z.string().transform(value => Duration.fromISO(value))),
});

export type UseGameState = {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
};
