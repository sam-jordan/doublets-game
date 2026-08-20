import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './pages/app';
// import Login from './pages/login';
import NotFound from './pages/not-found';

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='*' element={<NotFound />} />
                <Route path='/' element={<App />} />
                {/* <Route path='/login' element={<Login />} /> */}
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
