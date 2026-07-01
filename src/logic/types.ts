export enum Difficulties {
    EASY,
    MEDIUM,
    HARD,
}

export enum Status {
    FIXED,
    CHECKED,
    UNCHECKED,
}

export type Word = {
    index: number;
    letters: string[];
    status: Status;
};

export type Puzzle = { startWord: string; endWord: string };

type FixedProps = Word & {
    status: Status.FIXED;
    difficulty: Difficulties;
};

type GuessProps = Word & {
    status: Status.CHECKED | Status.UNCHECKED;
    difficulty: Difficulties;
    currentGuess: boolean;
    setCurrentGuess: React.Dispatch<React.SetStateAction<number>>;
};

export type RowProps = FixedProps | GuessProps;
