import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './pages/app';
import Login from './pages/login';
import NotFound from './pages/not-found';
import Signup from './pages/signup';
import { StatsApiError } from './logic/types';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry(_failureCount, error) {
                // Retrying client errors will not change the result
                return !(
                    error instanceof StatsApiError &&
                    error.status >= 400 &&
                    error.status < 500
                );
            },
        },
    },
});

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path='*' element={<NotFound />} />
                    <Route path='/' element={<App />} />
                    <Route path='/user/login' element={<Login />} />
                    <Route path='/user/signup' element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);
