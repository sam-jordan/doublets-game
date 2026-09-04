import { useState } from 'react';
import { DateTime, Duration } from 'luxon';
// import { Link } from 'react-router';
// import clsx from 'clsx';
import {
    DIFFICULTIES,
    gameStateSchema,
    viteEnvironment,
    type Difficulties,
    type GameState,
} from '../logic/types';
import { emptyGuesses } from '../logic/empty-guesses';
// import { getPuzzle } from '../logic/get-puzzle';
// import { useCurrentUser } from '../logic/queries';
// import Loading from './loading';
// import Game from './game';

export default function App() {
    const date = DateTime.now().toUTC();
    const cached = getFromCache(date);

    // Main state
    const [gameState, setGameState] = useState<GameState>(
        cached ?? {
            guesses: emptyGuesses(),
            currentGuess: 0,
            difficulty: 'easy',
            solved: Object.fromEntries(
                DIFFICULTIES.map(difficulty => [difficulty, undefined])
            ) as Record<Difficulties, number | undefined>,
            timers: Object.fromEntries(
                DIFFICULTIES.map(difficulty => [
                    difficulty,
                    Duration.fromMillis(0),
                ])
            ) as Record<Difficulties, Duration>,
            attempted: Object.fromEntries(
                DIFFICULTIES.map(d => [d, false])
            ) as Record<Difficulties, boolean>,
        }
    );

    const [launched, setLaunched] = useState<boolean>(cached !== undefined);

    const parsed = viteEnvironment.safeParse(import.meta.env);

    return <p>{`${parsed.error?.name}:${parsed.error?.message}`}</p>;

    // const currentUser = useCurrentUser();

    // if (launched) {
    //     return <Game gameState={gameState} setGameState={setGameState} />;
    // }

    // const puzzle = getPuzzle(gameState.difficulty);

    // return currentUser.isPending ? (
    //     <Loading size='6rem' />
    // ) : (
    //     <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-pink-bright text-white flex flex-col justify-center items-center'>
    //         <div className='flex flex-col justify-between items-center gap-4'>
    //             <img
    //                 src='/logo.png'
    //                 className='w-32 h-37.5'
    //                 alt='Doublets logo'
    //             />
    //             <h2 className='text-5xl font-extrabold'>Doublets</h2>
    //             <p className='text-xl sm:text-2xl text-center'>
    //                 Get from the start word to the end <br /> by changing one
    //                 letter at a time.
    //             </p>
    //             <div
    //                 className={clsx(
    //                     'font-(family-name:--standard-fonts) flex flex-col gap-2',
    //                     'sm:flex-row sm:gap-4'
    //                 )}
    //             >
    //                 {currentUser.isError ? (
    //                     <Link
    //                         className='bg-grey-very-dark text-xl py-3 rounded-4xl w-48 cursor-pointer text-center'
    //                         to='/user/login'
    //                     >
    //                         Log in
    //                     </Link>
    //                 ) : null}
    //                 <button
    //                     type='button'
    //                     className='bg-grey-very-dark text-xl py-3 rounded-4xl w-48 cursor-pointer text-center'
    //                     onClick={() => {
    //                         setLaunched(true);
    //                     }}
    //                 >
    //                     Play
    //                 </button>
    //             </div>
    //             <div className='flex flex-col justify-center items-center'>
    //                 <p className='font-(family-name:--standard-fonts)'>
    //                     {date.toLocaleString(DateTime.DATE_MED)}
    //                 </p>
    //                 <p className='font-(family-name:--standard-fonts)'>
    //                     {`No. ${puzzle.index + 1}`}
    //                 </p>
    //             </div>
    //         </div>
    //     </div>
    // );
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

    const parsed = gameStateSchema.parse(JSON.parse(cached));
    return parsed;
}
