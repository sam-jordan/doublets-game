import { Link } from 'react-router-dom';
import { Duration } from 'luxon';
import { useState } from 'react';
import clsx from 'clsx';
import { useCurrentUser } from '../../logic/queries';
import LoadingSpinner from '../loading-spinner';
import { DIFFICULTIES, type Difficulties } from '../../logic/types';

type StatsProps = {
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<'help' | 'select-difficulty' | 'stats' | undefined>
    >;
};

export default function Stats({ setOverlay }: StatsProps) {
    const [difficulty, setDifficulty] = useState<Difficulties>('easy');

    const currentUser = useCurrentUser();

    // Temporary object for developing frontend
    const stats = {
        easy: {
            puzzlesAttempted: 12,
            puzzlesSolved: 10,
            wordsUsed: 43,
            averageTime: Duration.fromMillis(3 * 60 * 1000),
            averageGuesses: 4,
        },
        medium: {
            puzzlesAttempted: 9,
            puzzlesSolved: 5,
            wordsUsed: 28,
            averageTime: Duration.fromMillis(5.2 * 60 * 1000),
            averageGuesses: 5.3,
        },
        hard: {
            puzzlesAttempted: 8,
            puzzlesSolved: 4,
            wordsUsed: 22,
            averageTime: Duration.fromMillis(7.1 * 60 * 1000),
            averageGuesses: 7.5,
        },
    };

    return currentUser.isPending ? (
        <LoadingSpinner size='4rem' />
    ) : (
        <>
            <div className='flex justify-between mb-2'>
                <h2 className='font-(family-name:--title-fonts) font-bold text-2xl'>
                    Statistics
                </h2>
                <button
                    type='button'
                    className='w-4 cursor-pointer -mt-4'
                    onClick={() => {
                        setOverlay(undefined);
                    }}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 640 640'
                    >
                        <path
                            fill='rgb(255, 255, 255)'
                            d='M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z'
                        />
                    </svg>
                </button>
            </div>
            {currentUser.isError ? (
                <Link
                    className='font-(family-name:--standard-fonts) border-2 border-white w-48 cursor-pointer py-2 rounded-3xl hover:bg-grey-mid active:bg-grey-mid text-center'
                    to='/user/login'
                >
                    Log in
                </Link>
            ) : (
                <>
                    <div className='flex gap-4 font-bold mb-4'>
                        {DIFFICULTIES.map(d => (
                            <button
                                key={`${d}-tab`}
                                className={clsx(
                                    'rounded-lg p-2 w-32',
                                    difficulty === d
                                        ? 'bg-grey-mid'
                                        : 'bg-grey-very-dark'
                                )}
                                type='button'
                                onClick={() => {
                                    setDifficulty(d);
                                }}
                            >
                                {`${d.slice(0, 1).toUpperCase()}${d.slice(1)}`}
                            </button>
                        ))}
                    </div>
                    <div className='border-y-2 border-y-white flex justify-between p-4'>
                        <div>
                            <p>Puzzles attempted:</p>
                            <p>{stats[difficulty].puzzlesAttempted}</p>
                        </div>
                        <div>
                            <p>Puzzles solved:</p>
                            <p>{stats[difficulty].puzzlesSolved}</p>
                        </div>
                        <div>
                            <p>Success rate:</p>
                            <p>
                                {(
                                    (stats[difficulty].puzzlesSolved /
                                        stats[difficulty].puzzlesAttempted) *
                                    100
                                ).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className='border-b-2 border-y-white flex justify-between p-4'>
                        <div>
                            <p>Average guesses:</p>
                            <p>{stats[difficulty].averageGuesses}</p>
                        </div>
                        <div>
                            <p>Average time:</p>
                            <p>
                                {stats[difficulty].averageTime.milliseconds /
                                    1000}
                            </p>
                        </div>
                        <div>
                            <p>Words used:</p>
                            <p>{stats[difficulty].wordsUsed}</p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
