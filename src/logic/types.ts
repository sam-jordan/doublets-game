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

export type Puzzle = { startWord: string; endWord: string };

type Word = {
    index: number;
    letters: string[];
};

export type Guess = Word & {
    type: WordTypes.GUESS;
    changed: number[];
};

type Fixed = Word & {
    type: WordTypes.FIXED;
};

type GuessProps = Guess & {
    currentGuess: boolean;
    setCurrentGuess: React.Dispatch<React.SetStateAction<number>>;
    lastTyped: number | undefined;
    useShake: number | undefined;
};

export type RowProps = Fixed | GuessProps;

export type Validation =
    | {
          valid: false;
          message: string;
          index: number;
      }
    | { valid: true };

export const dictionaryWord = z.object({
    word: z.string(),
    entries: z
        .array(
            z.object({
                language: z.object({
                    code: z.string(),
                    name: z.string(),
                }),
            })
        )
        .min(1),
});

export enum Pages {
    START,
    GAME,
}
