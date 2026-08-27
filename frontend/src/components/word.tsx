import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { type RowProps } from '../logic/types';

export default function Row(props: RowProps) {
    const [letterJump, setLetterJump] = useState<number | undefined>(undefined);

    const shouldUseShake =
        props.type !== 'fixed' && props.useShake === props.index;
    const shouldUseJump =
        props.type !== 'fixed' && props.useJump === props.index;

    useEffect(() => {
        const timers: number[] = [];
        if (props.gameWin === props.index) {
            for (let i = 0; i < props.letters.length; i++) {
                const timer = setTimeout(() => {
                    setLetterJump(i);
                }, 150 * i);

                timers.push(timer);

                if (i === props.letters.length - 1) {
                    const final = setTimeout(
                        () => {
                            setLetterJump(undefined);
                        },
                        150 * (i + 1)
                    );

                    timers.push(final);
                }
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- best practise for React
            () => {
                setLetterJump(undefined);
            };
        }

        return () => {
            for (const timer of timers) {
                clearTimeout(timer);
            }
        };
    }, [props.gameWin]);

    function handleClick() {
        if (props.type === 'fixed') {
            return;
        }

        props.setGameState({ ...props.gameState, currentGuess: props.index });
        props.setUseJump(props.index);
    }

    return (
        <button
            type='button'
            tabIndex={0}
            className={clsx(
                'grid grid-cols-5 w-81 h-16',
                props.type === 'fixed' ? '' : 'cursor-pointer',
                shouldUseShake ? 'animate-shake' : '',
                shouldUseJump ? 'animate-jump' : ''
            )}
            onClick={handleClick}
        >
            {props.letters.map((character, charIndex) => (
                <div
                    // eslint-disable-next-line react/no-array-index-key -- position is more important than content here
                    key={`guess-${props.index}-char-${charIndex}`}
                    className={buildCharacterStyling(
                        character,
                        charIndex,
                        props,
                        letterJump
                    )}
                >
                    <strong>{character}</strong>
                </div>
            ))}
        </button>
    );
}

function buildCharacterStyling(
    character: string,
    index: number,
    props: RowProps,
    letterJump: number | undefined
): string {
    const isCurrentGuess =
        props.type === 'fixed'
            ? false
            : props.gameState.currentGuess === props.index;
    const shouldUseThrob =
        props.type !== 'fixed' &&
        isCurrentGuess &&
        index === props.lastTyped &&
        character !== ' ';

    const base = clsx(
        'text-4xl h-15 w-15 flex justify-center items-center border-2 select-none justify-self-center self-center font-medium',
        shouldUseThrob ? 'animate-throb' : '',
        letterJump === index ? 'animate-jump-quick' : ''
    );

    if (props.type === 'fixed') {
        return clsx(base, 'bg-white text-grey-very-dark border-white');
    }

    if (props.changed.includes(index)) {
        return clsx(
            base,
            'bg-pink-bright border-pink-bright',
            isCurrentGuess ? 'border-white' : ''
        );
    }

    if (character !== ' ') {
        return clsx(
            base,
            'bg-grey-mid',
            isCurrentGuess ? 'border-white' : 'border-grey-mid'
        );
    }

    return clsx(base, isCurrentGuess ? 'border-white' : 'border-grey-mid');
}
