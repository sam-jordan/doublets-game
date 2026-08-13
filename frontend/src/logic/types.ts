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
    gameWin: number | undefined;
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
        gameState: GameState;
        setGameState: React.Dispatch<React.SetStateAction<GameState>>;
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
    solved: Array<number | undefined>;
};
