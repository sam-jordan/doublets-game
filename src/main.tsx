import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Game from './components/game';

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <Game />
    </StrictMode>
);
