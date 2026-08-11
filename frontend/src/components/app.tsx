import { useState } from 'react';
import { DateTime } from 'luxon';
import { Pages } from '../logic/types';
import Game from './game';

export default function App() {
    const [page, setPage] = useState<Pages>(Pages.START);

    if (page === Pages.GAME) {
        return <Game />;
    }

    const date = DateTime.now();

    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh bg-pink-bright text-white flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-between items-center gap-4'>
                <svg width='127' height='150'>
                    <use xlinkHref='/logo.svg' />
                </svg>
                <h2 className='text-5xl font-extrabold'>Doublets</h2>
                <p className='text-xl sm:text-2xl text-center'>
                    Get from the start word to the end <br /> by changing one
                    letter at a time.
                </p>
                <button
                    type='button'
                    className='font-(family-name:--standard-fonts) bg-grey-very-dark text-xl py-2 rounded-3xl w-32 cursor-pointer'
                    onClick={() => {
                        setPage(Pages.GAME);
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
