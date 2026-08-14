import { useState } from 'react';
import { DateTime, Duration } from 'luxon';
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
                <button
                    type='button'
                    className='font-(family-name:--standard-fonts) bg-grey-very-dark text-xl py-2 rounded-3xl w-32 cursor-pointer font-bold'
                    onClick={() => {
                        setLaunched(true);
                    }}
                >
                    Play
                </button>
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

    if (cached === null) {
        localStorage.clear();
        return;
    }

    const parsed = gameStateSchema.parse(JSON.parse(cached));
    return parsed;
}
