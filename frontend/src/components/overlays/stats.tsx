import { Link } from 'react-router';
import { useState } from 'react';
import clsx from 'clsx';
import { signOut } from 'aws-amplify/auth';
import { useMutation } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { useCurrentUser, useStats } from '../../logic/queries';
import { DIFFICULTIES, type Difficulties } from '../../logic/types';
import OverlayCloseButton from '../overlay-close-button';
import configureAmplify from '../../logic/configure-amplify';
import { formatDuration } from '../../logic/format-duration';

type StatsProps = {
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<'help' | 'select-difficulty' | 'stats' | undefined>
    >;
    readonly difficulty: Difficulties;
};

export default function Stats({ setOverlay, difficulty }: StatsProps) {
    const [statsDifficulty, setStatsDifficulty] =
        useState<Difficulties>(difficulty);

    const currentUser = useCurrentUser();
    const stats = useStats({
        username: currentUser.data?.username,
        enabled: Boolean(currentUser.data?.username),
    });

    const mutation = useMutation({
        async mutationFn() {
            configureAmplify();
            await signOut();
        },
        onSuccess() {
            setOverlay(undefined);
            globalThis.location.reload();
        },
    });

    if (currentUser.isPending) {
        return (
            <div className='flex-1 flex flex-col justify-center items-center gap-2'>
                <p className='font-bold'>Loading...</p>
                <FontAwesomeIcon
                    icon={faCircleNotch}
                    style={{ color: 'rgb(255, 255, 255)' }}
                    size='4x'
                    className='animate-spin'
                />
            </div>
        );
    }

    if (currentUser.isError) {
        return (
            <div className='flex flex-col items-center gap-4'>
                <div className='flex justify-between w-full'>
                    <h2 className='font-(family-name:--title-fonts) font-bold text-2xl'>
                        Statistics
                    </h2>
                    <OverlayCloseButton setOverlay={setOverlay} />
                </div>
                <p className='text-center'>
                    Please log in or sign up to access gameplay statistics!
                </p>
                <Link
                    className='border-2 border-white w-48 cursor-pointer py-2 rounded-3xl hover:bg-grey-mid active:bg-grey-mid text-center'
                    to='/user/login'
                >
                    Log in
                </Link>
            </div>
        );
    }

    if (stats.isPending) {
        return (
            <div className='flex-1 flex flex-col justify-center items-center gap-2'>
                <p className='font-bold'>Loading...</p>
                <FontAwesomeIcon
                    icon={faCircleNotch}
                    style={{ color: 'rgb(255, 255, 255)' }}
                    size='4x'
                    className='animate-spin'
                />
            </div>
        );
    }

    if (stats.isError) {
        return (
            <div className='flex flex-col items-center gap-4'>
                <div className='flex justify-between w-full'>
                    <h2 className='font-(family-name:--title-fonts) font-bold text-2xl'>
                        Statistics
                    </h2>
                    <OverlayCloseButton setOverlay={setOverlay} />
                </div>
                <p>
                    We&apos;re sorry, there was an error retrieving your
                    statistics.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className='flex justify-between mb-2'>
                <h2 className='font-(family-name:--title-fonts) font-bold text-2xl'>
                    Statistics
                </h2>
                <OverlayCloseButton setOverlay={setOverlay} />
            </div>
            <div className='flex gap-4 font-bold mb-4'>
                {DIFFICULTIES.map(d => (
                    <button
                        key={`${d}-tab`}
                        className={clsx(
                            'rounded-lg p-2 w-36',
                            statsDifficulty === d
                                ? 'bg-grey-mid'
                                : 'bg-grey-very-dark'
                        )}
                        type='button'
                        onClick={() => {
                            setStatsDifficulty(d);
                        }}
                    >
                        {`${d.slice(0, 1).toUpperCase()}${d.slice(1)}`}
                    </button>
                ))}
            </div>
            <div className='border-y-2 border-y-white flex justify-between p-4'>
                <div className='w-24 sm:w-36'>
                    <p className='text-3xl text-center'>
                        {stats.data[statsDifficulty].puzzlesAttempted}
                    </p>
                    <p className='text-center'>Puzzles attempted</p>
                </div>
                <div className='w-24 sm:w-36'>
                    <p className='text-3xl text-center'>
                        {stats.data[statsDifficulty].puzzlesSolved}
                    </p>
                    <p className='text-center'>Puzzles solved</p>
                </div>
                <div className='w-24 sm:w-36'>
                    <p className='text-3xl text-center'>
                        {stats.data[statsDifficulty].puzzlesAttempted > 0
                            ? Math.round(
                                  (stats.data[statsDifficulty].puzzlesSolved /
                                      stats.data[statsDifficulty]
                                          .puzzlesAttempted) *
                                      100
                              )
                            : 0}
                    </p>
                    <p className='text-center'>Success rate (%)</p>
                </div>
            </div>
            <div className='border-b-2 border-y-white flex justify-between p-4'>
                <div className='w-24 sm:w-36'>
                    <p className='text-3xl text-center'>
                        {stats.data[statsDifficulty].averageGuesses}
                    </p>
                    <p className='text-center'>Average guesses</p>
                </div>
                <div className='w-24 sm:w-36'>
                    <p className='text-3xl text-center'>
                        {formatDuration(
                            stats.data[statsDifficulty].averageTime
                        )}
                    </p>
                    <p className='text-center'>Average time</p>
                </div>
                <div className='w-24 sm:w-36'>
                    <p className='text-3xl text-center'>
                        {stats.data[statsDifficulty].wordsUsed}
                    </p>
                    <p className='text-center'>Words used</p>
                </div>
            </div>
            <div className='flex justify-center mt-4'>
                <button
                    className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl font-bold'
                    type='button'
                    onClick={() => {
                        mutation.mutate();
                    }}
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
