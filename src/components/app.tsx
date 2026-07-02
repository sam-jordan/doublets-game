import { useState } from 'react';
import { Pages } from '../logic/types';
import Game from './game';

export default function App() {
    const [page, setPage] = useState<Pages>(Pages.START);

    if (page === Pages.GAME) {
        return <Game />;
    }

    return <div className='font-(family-name:--use-font-family) w-screen h-screen bg-pink-bright text-white flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-between gap-4'>
            <h2 className='text-5xl'>Doublets</h2>
            <button onClick={() => setPage(Pages.GAME)} className='bg-grey-very-dark text-xl py-2 rounded-3xl'>
                Play
            </button>
        </div>
    </div>
}
