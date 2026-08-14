import { useState } from 'react';
import { DateTime, Duration } from 'luxon';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Difficulties, gameStateSchema, type GameState } from '../logic/types';
import { emptyGuesses } from '../logic/empty-guesses';
import Game from './game';

export default function App() {
    const date = DateTime.now();
    const cached = getFromCache(date);

    // Main state
    const [gameState, setGameState] = useState<GameState>(
        cached ?? {
            guesses: emptyGuesses(),
            currentGuess: 0,
            difficulty: Difficulties.EASY,
            solved: Array.from({ length: 3 }, _ => undefined),
            timers: Array.from({ length: 3 }, () => Duration.fromMillis(0)),
        }
    );

    const [launched, setLaunched] = useState<boolean>(cached !== undefined);

    if (launched) {
        return <Game gameState={gameState} setGameState={setGameState} />;
    }

    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh bg-pink-bright text-white flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-between items-center gap-4'>
                <img
                    src='/logo.png'
                    className='w-32 h-37.5'
                    alt='Doublets logo'
                />
                <h2 className='text-5xl font-extrabold'>Doublets</h2>
                <p className='text-xl sm:text-2xl text-center'>
                    Get from the start word to the end <br /> by changing one
                    letter at a time.
                </p>
                <div
                    className={clsx(
                        'font-(family-name:--standard-fonts) flex flex-col gap-2',
                        'sm:flex-row sm:gap-4'
                    )}
                >
                    <Link
                        className='bg-grey-very-dark text-xl py-3 rounded-4xl w-48 cursor-pointer text-center'
                        to='/login'
                    >
                        Log in
                    </Link>
                    <button
                        type='button'
                        className='bg-grey-very-dark text-xl py-3 rounded-4xl w-48 cursor-pointer text-center'
                        onClick={() => {
                            setLaunched(true);
                        }}
                    >
                        Play
                    </button>
                </div>
                <p className='font-(family-name:--standard-fonts)'>
                    {date.toLocaleString(DateTime.DATE_MED)}
                </p>
            </div>
        </div>
    );
}

function getFromCache(date: DateTime): GameState | undefined {
    const cached = localStorage.getItem(
        date.toLocaleString(DateTime.DATE_SHORT)
    );

    // Clear cache if no entry for current date or running in development mode
    if (
        cached === null ||
        (globalThis.location.hostname === 'localhost' &&
            globalThis.location.port === '5173')
    ) {
        localStorage.clear();
        return;
    }

    const parsed = gameStateSchema.parse(JSON.parse(cached));
    return parsed;
}
