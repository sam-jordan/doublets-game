/* eslint-disable @stylistic/no-mixed-operators -- conflicts with Prettier */

import clsx from 'clsx';
import { type GameState } from '../logic/types';
import HeaderButton from './header-button';

type HeaderProps = {
    readonly overlay: 'help' | 'select-difficulty' | 'stats' | undefined;
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<'help' | 'select-difficulty' | 'stats' | undefined>
    >;
    readonly addGuess: () => void;
    readonly removeGuess: () => void;
    readonly gameState: GameState;
};

export default function Header({
    overlay,
    setOverlay,
    addGuess,
    removeGuess,
    gameState,
}: HeaderProps) {
    const { solved, difficulty, timers } = gameState;

    const seconds =
        timers[difficulty].seconds + timers[difficulty].milliseconds / 1000;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

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
                    {`${difficulty.slice(0, 1).toUpperCase()}${difficulty.slice(1)}`}
                </p>
                <p className='font-(family-name:--standard-fonts)'>
                    {`${hours > 0 ? `${hours}:${minutes - hours * 60}` : minutes}:${seconds - minutes * 60 < 10 ? `0${seconds - minutes * 60}` : seconds - minutes * 60}`}
                    <span className='inline-flex'>
                        {solved[difficulty] === undefined ? null : (
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 512 512'
                                className='ml-1'
                                height='0.75rem'
                                width='0.75rem'
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
                <HeaderButton
                    type='add-guess-overlay-button'
                    overlay={overlay}
                    setOverlay={setOverlay}
                    onClick={addGuess}
                />
                <HeaderButton
                    type='remove-guess-overlay-button'
                    overlay={overlay}
                    setOverlay={setOverlay}
                    onClick={removeGuess}
                />
                <HeaderButton
                    type='stats-overlay-button'
                    overlay={overlay}
                    setOverlay={setOverlay}
                    onClick={() => {
                        setOverlay('stats');
                    }}
                />
                <HeaderButton
                    type='difficulties-overlay-button'
                    overlay={overlay}
                    setOverlay={setOverlay}
                    onClick={() => {
                        setOverlay('select-difficulty');
                    }}
                />
                <HeaderButton
                    type='help-overlay-button'
                    overlay={overlay}
                    setOverlay={setOverlay}
                    onClick={() => {
                        setOverlay('help');
                    }}
                />
            </div>
        </header>
    );
}
