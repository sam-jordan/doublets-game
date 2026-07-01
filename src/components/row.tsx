import { getPuzzle } from '../logic/get-puzzle';
import { Status, type RowProps } from '../logic/types';

export default function Row(props: RowProps) {
    function handleClick() {
        if (props.status !== Status.FIXED) {
            props.setCurrentGuess(props.index);
        }
    }

    return (
        <div
            tabIndex={0}
            className='grid grid-cols-5 w-66 h-13'
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
    props: RowProps
): string {
    const isCurrentGuess =
        props.status === Status.FIXED ? false : props.currentGuess;
    const base =
        'text-3xl max-h-12 max-w-12 flex justify-center items-center border-2';
    const puzzle = getPuzzle(props.difficulty);

    if (props.status === Status.FIXED) {
        return base + ' bg-white text-dark-bg border-white';
    }

    if (props.status === Status.CHECKED) {
        if (puzzle.endWord.split('')[index] === char) {
            return base + ' bg-correct';
        }

        return base + ' bg-inactive-border';
    }

    return (
        base + (isCurrentGuess ? ' border-white' : ' border-inactive-border')
    );
}
