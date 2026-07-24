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

type Animations = {
    lastTyped: number | undefined;
    useShake: number | undefined;
    useJump: number | undefined;
    setUseJump: React.Dispatch<React.SetStateAction<number | undefined>>;
};

type GuessProps = Guess &
    Animations & {
        currentGuess: boolean;
        setCurrentGuess: React.Dispatch<React.SetStateAction<number>>;
    };

export type RowProps = Fixed | GuessProps;

export type Validation =
    | {
          valid: false;
          message: string;
          index: number;
      }
    | { valid: true };

export enum Pages {
    START,
    GAME,
}
