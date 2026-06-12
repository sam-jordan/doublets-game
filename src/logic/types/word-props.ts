import type { Difficulties } from "./difficulties";
import type { Guess } from "./guess";
import type { Status } from "./status";

type PuzzleProps = {
    index: string,
    letters: string[],
    status: Status.PUZZLE,
    difficulty: Difficulties,
};

type GuessProps = Guess & {
    difficulty: Difficulties,
    setCurrentGuess: React.Dispatch<React.SetStateAction<number>>,
};

export type WordProps = PuzzleProps | GuessProps;