/* eslint-disable @stylistic/no-mixed-operators -- conflicts with Prettier */

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Duration } from 'luxon';
import { Difficulties } from '../logic/types';

export default function Header(props: {
    readonly handleDifficulty: (nextDifficulty: Difficulties) => void;

    readonly overlay: string | undefined;
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<string | undefined>
    >;
    readonly addGuess: () => void;
    readonly removeGuess: () => void;
    readonly difficulty: Difficulties;
    readonly solved: Array<number | undefined>;
}) {
    const [showDifficulties, setShowDifficulties] = useState<boolean>(false);
    const [timers, setTimers] = useState<Duration[]>(
        Array.from({ length: 3 }, () => Duration.fromMillis(0))
    );

    const timerTimeoutRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (props.solved[props.difficulty] !== undefined) {
            return;
        }

        timerTimeoutRef.current = setTimeout(() => {
            setTimers(
                timers.map(timer => {
                    if (timers.indexOf(timer) === props.difficulty.valueOf()) {
                        return timer.plus(Duration.fromMillis(1000));
                    }

                    return timer;
                })
            );
        }, 1000);

        return () => {
            clearTimeout(timerTimeoutRef.current);
        };
    }, [timers, props.difficulty]);

    useEffect(() => {
        function handleClick(event: Event) {
            if (!(
                event.target instanceof HTMLElement ||
                event.target instanceof SVGElement
            )) {
                return;
            }

            if (
                (!event.target.closest('div')?.classList.contains('overlay') &&
                    props.overlay !== undefined) ||
                (props.overlay === undefined &&
                    event.target.closest('button')?.id === 'help-button')
            ) {
                props.setOverlay(undefined);
            }

            if (
                props.overlay === undefined &&
                ((showDifficulties &&
                    event.target.id !== 'difficulties-dropdown') ||
                    (!showDifficulties &&
                        event.target.closest('button')?.id ===
                            'difficulties-button'))
            ) {
                setShowDifficulties(!showDifficulties);
            }
        }

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    });

    const hours = Math.floor(
        timers[props.difficulty].milliseconds / (60 * 60 * 1000)
    );
    const minutes = Math.floor(
        timers[props.difficulty].milliseconds / (60 * 1000) - hours * 60
    );
    const seconds = timers[props.difficulty].milliseconds / 1000 - minutes * 60;

    return (
        <header className='flex justify-between border-b px-4'>
            <div className='flex items-center gap-4'>
                <h1
                    className={clsx(
                        'font-(family-name:--title-fonts) text-3xl text-pink-bright py-2 font-extrabold hidden',
                        'sm:block'
                    )}
                >
                    DOUBLETS
                </h1>
                <p className='font-(family-name:--standard-fonts)'>
                    {`${Difficulties[props.difficulty].slice(0, 1)}${Difficulties[props.difficulty].slice(1).toLowerCase()}`}
                </p>
                <p className='font-(family-name:--standard-fonts)'>
                    {`${hours > 0 ? `${hours}:${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                    <span className='inline-flex h-3'>
                        {props.solved[props.difficulty] === undefined ? null : (
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 512 512'
                                className='ml-1'
                            >
                                <path
                                    fill='rgb(255, 255, 255)'
                                    d='M144.3 0l224 0c26.5 0 48.1 21.8 47.1 48.2-.2 5.3-.4 10.6-.7 15.8l49.6 0c26.1 0 49.1 21.6 47.1 49.8-7.5 103.7-60.5 160.7-118 190.5-15.8 8.2-31.9 14.3-47.2 18.8-20.2 28.6-41.2 43.7-57.9 51.8l0 73.1 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0 0-73.1c-16-7.7-35.9-22-55.3-48.3-18.4-4.8-38.4-12.1-57.9-23.1-54.1-30.3-102.9-87.4-109.9-189.9-1.9-28.1 21-49.7 47.1-49.7l49.6 0c-.3-5.2-.5-10.4-.7-15.8-1-26.5 20.6-48.2 47.1-48.2zM101.5 112l-52.4 0c6.2 84.7 45.1 127.1 85.2 149.6-14.4-37.3-26.3-86-32.8-149.6zM380 256.8c40.5-23.8 77.1-66.1 83.3-144.8L411 112c-6.2 60.9-17.4 108.2-31 144.8z'
                                />
                            </svg>
                        )}
                    </span>
                </p>
            </div>
            <div className='flex justify-between gap-x-2'>
                <button
                    type='button'
                    className={clsx(
                        'w-12 p-2',
                        props.overlay === undefined
                            ? 'hover:bg-grey-mid cursor-pointer'
                            : ''
                    )}
                    onClick={() => {
                        if (props.overlay === undefined) {
                            props.addGuess();
                        }
                    }}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 448 512'
                    >
                        <path
                            fill='rgb(255, 255, 255)'
                            d='M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z'
                        />
                    </svg>
                </button>
                <button
                    type='button'
                    className={clsx(
                        'w-12 p-2',
                        props.overlay === undefined
                            ? 'hover:bg-grey-mid cursor-pointer'
                            : ''
                    )}
                    onClick={() => {
                        if (props.overlay === undefined) {
                            props.removeGuess();
                        }
                    }}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 448 512'
                    >
                        <path
                            fill='rgb(255, 255, 255)'
                            d='M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z'
                        />
                    </svg>
                </button>
                <button
                    type='button'
                    className={clsx(
                        'w-12 p-2',
                        props.overlay === undefined
                            ? 'hover:bg-grey-mid cursor-pointer'
                            : ''
                    )}
                    id='difficulties-button'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 640 640'
                    >
                        <path
                            fill='rgb(255, 255, 255)'
                            d='M96 176C96 149.5 117.5 128 144 128C170.5 128 192 149.5 192 176L192 288L448 288L448 176C448 149.5 469.5 128 496 128C522.5 128 544 149.5 544 176L544 192L560 192C586.5 192 608 213.5 608 240L608 288C625.7 288 640 302.3 640 320C640 337.7 625.7 352 608 352L608 400C608 426.5 586.5 448 560 448L544 448L544 464C544 490.5 522.5 512 496 512C469.5 512 448 490.5 448 464L448 352L192 352L192 464C192 490.5 170.5 512 144 512C117.5 512 96 490.5 96 464L96 448L80 448C53.5 448 32 426.5 32 400L32 352C14.3 352 0 337.7 0 320C0 302.3 14.3 288 32 288L32 240C32 213.5 53.5 192 80 192L96 192L96 176z'
                        />
                    </svg>
                </button>
                {showDifficulties ? (
                    <ul
                        className='font-(family-name:--standard-fonts) absolute top-13.25 right-6'
                        id='difficulties-dropdown'
                    >
                        <li>
                            <button
                                type='button'
                                className='bg-grey-very-dark border border-white w-24 cursor-pointer p-y-1 hover:bg-grey-mid z-99'
                                onClick={() => {
                                    props.handleDifficulty(Difficulties.EASY);
                                }}
                            >
                                Easy
                            </button>
                        </li>
                        <li>
                            <button
                                type='button'
                                className='bg-grey-very-dark border border-white w-24 cursor-pointer p-y-1 hover:bg-grey-mid z-99'
                                onClick={() => {
                                    props.handleDifficulty(Difficulties.MEDIUM);
                                }}
                            >
                                Medium
                            </button>
                        </li>
                        <li>
                            <button
                                type='button'
                                className='bg-grey-very-dark border border-white w-24 cursor-pointer p-y-1 hover:bg-grey-mid z-99'
                                onClick={() => {
                                    props.handleDifficulty(Difficulties.HARD);
                                }}
                            >
                                Hard
                            </button>
                        </li>
                    </ul>
                ) : null}
                <button
                    type='button'
                    className={clsx(
                        'w-12 p-2',
                        props.overlay === undefined
                            ? 'hover:bg-grey-mid cursor-pointer'
                            : ''
                    )}
                    id='help-button'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 640 640'
                    >
                        <path
                            fill='rgb(255, 255, 255)'
                            d='M528 320C528 205.1 434.9 112 320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 240C302.3 240 288 254.3 288 272C288 285.3 277.3 296 264 296C250.7 296 240 285.3 240 272C240 227.8 275.8 192 320 192C364.2 192 400 227.8 400 272C400 319.2 364 339.2 344 346.5L344 350.3C344 363.6 333.3 374.3 320 374.3C306.7 374.3 296 363.6 296 350.3L296 342.2C296 321.7 310.8 307 326.1 302C332.5 299.9 339.3 296.5 344.3 291.7C348.6 287.5 352 281.7 352 272.1C352 254.4 337.7 240.1 320 240.1zM288 432C288 414.3 302.3 400 320 400C337.7 400 352 414.3 352 432C352 449.7 337.7 464 320 464C302.3 464 288 449.7 288 432z'
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
}
