import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './components/app';
import Login from './components/login';

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
