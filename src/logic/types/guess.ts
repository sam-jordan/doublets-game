import type { Status } from "./status";

export type Guess = {
    index: number,
    letters: string[],
    status: Status.CHECKED | Status.UNCHECKED,
};