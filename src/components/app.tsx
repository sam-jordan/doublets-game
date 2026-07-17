import { useState } from 'react';
import { Pages } from '../logic/types';
import Game from './game';

export default function App() {
    const [page, setPage] = useState<Pages>(Pages.START);

    const date = Temporal.Now.plainDateISO();
    const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    if (page === Pages.GAME) {
        return <Game />;
    }

    return (
        <div className='font-(family-name:--title-fonts) w-screen h-screen bg-pink-bright text-white flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-between items-center gap-4'>
                <svg>
                    <use xlinkHref='../../static/logo.svg' />
                </svg>
                <h2 className='text-5xl font-extrabold'>Doublets</h2>
                <p className='text-2xl text-center'>
                    Get from the start word to the end <br /> by changing one
                    letter at a time.
                </p>
                <button
                    onClick={() => {
                        setPage(Pages.GAME);
                    }}
                    className='font-(family-name:--standard-fonts) bg-grey-very-dark text-xl py-2 rounded-3xl w-32 cursor-pointer'
                >
                    Play
                </button>
                <p className='font-(family-name:--standard-fonts)'>{formatter.format(date)}</p>
            </div>
        </div>
    );
}
