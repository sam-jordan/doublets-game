import { getPuzzle } from '../logic/get-puzzle';
import { Status, type WordProps } from '../logic/types';

export default function Word(props: WordProps) {
    function handleClick() {
        if (props.status !== Status.PUZZLE) {
            props.setCurrentGuess(props.index);
        }
    }

    return (
        <div
            tabIndex={0}
            className='grid grid-cols-5 w-66 h-13 focus:outline-none'
            onClick={handleClick}
        >
            {props.letters.map((character, charIndex) => (
                <div
                    key={`guess-${props.index}-char-${charIndex}`}
                    className={buildCharacterStyling(
                        character,
                        charIndex,
                        props
                    )}
                >
                    <strong>{character}</strong>
                </div>
            ))}
        </div>
    );
}

// TODO - add an indicator for letters that changed from the last guess
function buildCharacterStyling(
    char: string,
    index: number,
    props: WordProps
): string {
    const isCurrentGuess =
        props.status === Status.PUZZLE ? false : props.currentGuess;
    const base = 'text-3xl max-h-12 max-w-12 flex justify-center items-center';
    const puzzle = getPuzzle(props.difficulty);

    if (props.status === Status.PUZZLE) {
        return base + ' bg-white text-dark-bg';
    }

    if (props.status === Status.CHECKED) {
        if (puzzle.endWord.split('')[index] === char) {
            return base + ' bg-correct';
        }

        return base + ' bg-inactive-border';
    }

    return base + (isCurrentGuess ? '' : ' border-2 border-inactive-border');
}
