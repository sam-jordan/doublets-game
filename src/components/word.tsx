import type { Difficulties } from "../logic/types/difficulties";
import { getPuzzle } from "../logic/get-puzzle";
import type { WordProps } from "../logic/types/word-props";
import { Status } from "../logic/types/status";

export default function Word(props: WordProps) {
    function handleClick() {
        if (props.status !== Status.PUZZLE) {
            props.setCurrentGuess(props.index);
        };
    }

    return (
        <div tabIndex={0} className='grid grid-cols-5 w-66 h-13' onClick={handleClick}>
            {props.letters.map((character, charIndex) =>
                <div key={`guess-${props.index}-char-${charIndex}`} className={buildCharacterStyling(character, props.status, props.difficulty)}>
                    <strong>{character}</strong>
                </div>
            )}
        </div>
    );
}

// TODO - update this to check letter positions
// TODO - add an indicator for letters that changed from the last guess
function buildCharacterStyling(char: string, status: Status, difficulty: Difficulties): string {
    const base = (status === Status.UNCHECKED ? 'border-2 border-inactive-border ' : (status === Status.PUZZLE ? 'bg-white text-dark-bg ' : ' ')) + 'text-3xl max-h-12 max-w-12 flex justify-center items-center';

    const puzzle = getPuzzle(difficulty);
    if (puzzle.endWord.split('').includes(char) && status === Status.CHECKED) {
        return base + ' bg-correct';
    }

    if (status === Status.CHECKED) {
        return base + ' bg-inactive-border';
    }

    return base;
}