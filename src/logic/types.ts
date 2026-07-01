export enum Difficulties {
    EASY,
    MEDIUM,
    HARD,
}

export enum Status {
    PUZZLE,
    CHECKED,
    UNCHECKED,
}

export type Guess = {
    index: number;
    letters: string[];
    status: Status.CHECKED | Status.UNCHECKED;
};

export type Puzzle = { startWord: string; endWord: string };

type PuzzleProps = {
    index: string;
    letters: string[];
    status: Status.PUZZLE;
    difficulty: Difficulties;
};

type GuessProps = Guess & {
    difficulty: Difficulties;
    currentGuess: boolean;
    setCurrentGuess: React.Dispatch<React.SetStateAction<number>>;
};

export type WordProps = PuzzleProps | GuessProps;
