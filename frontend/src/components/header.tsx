import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Difficulties } from '../logic/types';

export default function Header(props: {
    readonly handleDifficulty: (nextDifficulty: Difficulties) => void;
    // eslint-disable-next-line react/boolean-prop-naming -- too strict
    readonly showHelp: boolean;
    readonly setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
    readonly addGuess: () => void;
    readonly removeGuess: () => void;
    readonly difficulty: Difficulties;
}) {
    const [showDifficulties, setShowDifficulties] = useState<boolean>(false);

    useEffect(() => {
        function handleClick(event: Event) {
            if (!(
                event.target instanceof HTMLElement ||
                event.target instanceof SVGElement
            )) {
                return;
            }

            if (
                (!event.target.closest('div')?.classList.contains('help-box') &&
                    props.showHelp) ||
                (!props.showHelp &&
                    event.target.closest('button')?.id === 'help-button')
            ) {
                props.setShowHelp(!props.showHelp);
            }

            if (
                !props.showHelp &&
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

    return (
        <header className='flex justify-between border-b px-4'>
            <div className='flex items-center gap-4'>
                <h1 className='font-(family-name:--title-fonts) text-3xl text-pink-bright py-2 font-extrabold invisible sm:visible'>
                    DOUBLETS
                </h1>
                <p className='font-(family-name:--standard-fonts)'>
                    {`${Difficulties[props.difficulty].slice(0, 1)}${Difficulties[props.difficulty].slice(1).toLowerCase()}`}
                </p>
            </div>
            <div className='flex justify-between gap-x-2'>
                <button
                    type='button'
                    className={clsx(
                        'w-12 p-2',
                        props.showHelp ? '' : 'hover:bg-grey-mid cursor-pointer'
                    )}
                    onClick={() => {
                        if (!props.showHelp) {
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
                        props.showHelp ? '' : 'hover:bg-grey-mid cursor-pointer'
                    )}
                    onClick={() => {
                        if (!props.showHelp) {
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
                        props.showHelp ? '' : 'hover:bg-grey-mid cursor-pointer'
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
                                className='border border-white w-24 cursor-pointer p-y-1 hover:bg-grey-mid'
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
                                className='border border-white w-24 cursor-pointer p-y-1 hover:bg-grey-mid'
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
                                className='border border-white w-24 cursor-pointer p-y-1 hover:bg-grey-mid'
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
                        props.showHelp ? '' : 'hover:bg-grey-mid cursor-pointer'
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
