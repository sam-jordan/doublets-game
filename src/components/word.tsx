import type { Difficulties } from "../logic/types/difficulties";
import { getPuzzle } from "../logic/get-puzzle";
import type { WordProps } from "../logic/types/word-props";
import { Status } from "../logic/types/status";

// TODO - figure out how to disable the default tabIndex outline
export default function Word(props: WordProps) {
    function handleClick() {
        if (props.status !== Status.PUZZLE) {
            props.setCurrentGuess(props.index);
        };
    };

    return (
        <div tabIndex={0} className='grid grid-cols-5 w-66 h-13' onClick={handleClick}>
            {props.letters.map((character, charIndex) =>
                <div key={`guess-${props.index}-char-${charIndex}`} className={buildCharacterStyling(character, charIndex, props.status, props.difficulty, props.status !== Status.PUZZLE ? props.currentGuess : false)}>
                    <strong>{character}</strong>
                </div>
            )}
        </div>
    );
}

// TODO - add an indicator for letters that changed from the last guess
function buildCharacterStyling(char: string, index: number, status: Status, difficulty: Difficulties, currentGuess: boolean): string {
    const base = (currentGuess ? 'border-2 border-white ' : '') + 'text-3xl max-h-12 max-w-12 flex justify-center items-center';
    const puzzle = getPuzzle(difficulty);

    if (status === Status.PUZZLE) {
        return base + ' bg-white text-dark-bg';
    };

    if (status === Status.CHECKED) {
        if (puzzle.endWord.split('')[index] === char) {
            return base + ' bg-correct';
        }

        return base + ' bg-inactive-border';
    };

    return base + (currentGuess ? '' : ' border-2 border-inactive-border');
}