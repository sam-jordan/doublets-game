import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { WordTypes, type RowProps } from '../logic/types';

export default function Row(props: RowProps) {
    const [letterJump, setLetterJump] = useState<number | undefined>(undefined);

    const shouldUseShake =
        props.type !== WordTypes.FIXED && props.useShake === props.index;
    const shouldUseJump =
        props.type !== WordTypes.FIXED && props.useJump === props.index;

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
            setLetterJump(undefined);
        }

        return () => {
            for (const timer of timers) {
                clearTimeout(timer);
            }
        };
    }, [props.gameWin]);

    function handleClick() {
        if (props.type === WordTypes.FIXED) {
            return;
        }

        props.setCurrentGuess(props.index);
        props.setUseJump(props.index);
    }

    return (
        <button
            tabIndex={0}
            className={clsx(
                'grid grid-cols-5 w-66 h-13',
                props.type === WordTypes.FIXED ? '' : 'cursor-pointer',
                shouldUseShake ? 'animate-shake' : '',
                shouldUseJump ? 'animate-jump' : ''
            )}
            onClick={handleClick}
        >
            {props.letters.map((character, charIndex) => (
                <div
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
        props.type === WordTypes.FIXED ? false : props.currentGuess;
    const shouldUseThrob =
        props.type !== WordTypes.FIXED &&
        isCurrentGuess &&
        index === props.lastTyped &&
        character !== ' ';

    const base = clsx(
        'text-3xl h-12 w-12 flex justify-center items-center border-2 select-none justify-self-center self-center',
        shouldUseThrob ? 'animate-throb' : '',
        letterJump === index ? 'animate-jump-quick' : ''
    );

    if (props.type === WordTypes.FIXED) {
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
