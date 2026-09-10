import { useEffect, useState } from 'react';
import { DateTime, Duration } from 'luxon';
import { Link } from 'react-router';
import clsx from 'clsx';
import {
    DIFFICULTIES,
    gameStateSchema,
    type Difficulties,
    type GameState,
} from '../../../shared/types';
import { emptyGuess, emptyGuesses } from '../logic/empty-guesses';
import { getPuzzle } from '../logic/get-puzzle';
import { useCurrentUser, useSync } from '../logic/queries';
import { getChanged } from '../logic/validators';
import Loading from './loading';
import Game from './game';

export default function App() {
    // Main state
    const [gameState, setGameState] = useState<GameState>({
        guesses: emptyGuesses(),
        currentGuess: 0,
        difficulty: 'easy',
        solved: Object.fromEntries(
            DIFFICULTIES.map(difficulty => [difficulty, undefined])
        ) as Record<Difficulties, number | undefined>,
        timers: Object.fromEntries(
            DIFFICULTIES.map(difficulty => [difficulty, Duration.fromMillis(0)])
        ) as Record<Difficulties, Duration<true>>,
        attempted: Object.fromEntries(
            DIFFICULTIES.map(d => [d, false])
        ) as Record<Difficulties, boolean>,
    });
    const [launched, setLaunched] = useState<boolean>(false);
    const [synced, setSynced] = useState<boolean>(false);

    // Queries
    const currentUser = useCurrentUser();
    const sync = useSync({
        username: currentUser.data?.username,
        enabled: !synced && Boolean(currentUser.data?.username),
    });

    const puzzle = getPuzzle(gameState.difficulty);
    const date = DateTime.now().toUTC();

    useEffect(() => {
        if (currentUser.isPending || synced) {
            return;
        }

        const cached = getFromCache(date);
        if (currentUser.isError) {
            if (cached !== undefined) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setGameState(cached);
            }

            setSynced(true);
        }

        if (currentUser.data) {
            if (sync.isPending) {
                return;
            }

            if (sync.isError) {
                console.error(sync.error);
            } else {
                let nextGameState = { ...gameState };
                for (const difficulty of DIFFICULTIES) {
                    const record = sync.data[difficulty];

                    if (record === undefined) {
                        if (cached !== undefined) {
                            nextGameState = {
                                guesses: {
                                    ...nextGameState.guesses,
                                    [difficulty]: cached.guesses[difficulty],
                                },
                                solved: {
                                    ...nextGameState.solved,
                                    [difficulty]: cached.solved[difficulty],
                                },
                                currentGuess: cached.currentGuess,
                                difficulty: cached.difficulty,
                                timers: {
                                    ...nextGameState.timers,
                                    [difficulty]: cached.timers[difficulty],
                                },
                                attempted: {
                                    ...nextGameState.attempted,
                                    [difficulty]: cached.attempted[difficulty],
                                },
                            };
                        }
                    } else {
                        nextGameState = {
                            ...nextGameState,

                            attempted: {
                                ...nextGameState.attempted,
                                [difficulty]: record.attempted,
                            },
                            solved: {
                                ...nextGameState.solved,
                                [difficulty]: DateTime.now().toMillis(),
                            },
                        };

                        if (!record.solved) {
                            continue;
                        }

                        nextGameState.timers[difficulty] = record.solveTime;
                        nextGameState.guesses[difficulty] = record.guesses.map(
                            (guess, index) => {
                                const empty = emptyGuess(index);
                                empty.letters = guess.split('');

                                if (index === 0) {
                                    empty.changed = getChanged(
                                        guess.split(''),
                                        puzzle.startWord.split('')
                                    );
                                } else {
                                    empty.changed = getChanged(
                                        guess.split(''),
                                        record.guesses[index - 1].split('')
                                    );
                                }

                                return empty;
                            }
                        );
                    }
                }

                setGameState(nextGameState);
                setSynced(true);
            }
        }
    }, [currentUser.status, sync.status]);

    if (currentUser.isPending || !synced) {
        return <Loading />;
    }

    if (launched && synced) {
        return (
            <Game
                gameState={gameState}
                setGameState={setGameState}
                currentUser={currentUser}
            />
        );
    }

    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-pink-bright text-white flex flex-col justify-center items-center'>
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
                    {currentUser.isError ? (
                        <Link
                            className='bg-grey-very-dark text-xl py-3 rounded-4xl w-48 cursor-pointer text-center'
                            to='/user/login'
                        >
                            Log in
                        </Link>
                    ) : null}
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
                <div className='flex flex-col justify-center items-center'>
                    <p className='font-(family-name:--standard-fonts)'>
                        {date.toLocaleString(DateTime.DATE_MED)}
                    </p>
                    <p className='font-(family-name:--standard-fonts)'>
                        {`No. ${puzzle.index + 1}`}
                    </p>
                </div>
            </div>
        </div>
    );
}

function getFromCache(date: DateTime): GameState | undefined {
    const cached = localStorage.getItem(
        `doublets:[${date.toLocaleString(DateTime.DATE_SHORT)}]`
    );

    // Remove all cached games if no entry for current date or running in development mode
    if (
        cached === null ||
        (globalThis.location.hostname === 'localhost' &&
            globalThis.location.port === '5173')
    ) {
        const keys = Object.keys(localStorage).filter(key =>
            key.startsWith('doublets:')
        );

        for (const key of keys) {
            localStorage.removeItem(key);
        }

        return;
    }

    const parsed = gameStateSchema.safeParse(JSON.parse(cached));

    if (parsed.success) {
        return parsed.data;
    }
}
