import { useState } from 'react';
import { Pages } from '../logic/types';
import Game from './game';

export default function App() {
    const [page, setPage] = useState<Pages>(Pages.GAME);

    if (page === Pages.GAME) {
        return <Game />;
    }
}
