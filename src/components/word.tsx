import { WordTypes, type RowProps } from '../logic/types';

export default function Row(props: RowProps) {
    function handleClick() {
        if (props.type !== WordTypes.FIXED) {
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

function buildCharacterStyling(
    character: string,
    index: number,
    props: RowProps
): string {
    const isCurrentGuess =
        props.type === WordTypes.FIXED ? false : props.currentGuess;
    const base =
        'text-3xl max-h-12 max-w-12 flex justify-center items-center border-2';

    if (props.type === WordTypes.FIXED) {
        return base + ' bg-white text-dark-bg border-white';
    }

    if (props.changed.includes(index)) {
        return (
            base +
            ' bg-correct border-correct' +
            (isCurrentGuess ? ' border-white' : '')
        );
    }

    if (character !== ' ') {
        return (
            base +
            ' bg-inactive-border' +
            (isCurrentGuess ? ' border-white' : ' border-inactive-border')
        );
    }

    return (
        base + (isCurrentGuess ? ' border-white' : ' border-inactive-border')
    );
}
