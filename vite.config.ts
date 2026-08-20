import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(env => ({
    plugins: [react(), tailwindcss()],
    test: {
        environment: 'jsdom',
    },
    root: env.mode === 'test' ? '.' : 'frontend',
    build: {
        outDir: 'build',
    },
    server: {
        // Caching is disabled on port 5173 only
        port: env.mode === 'cache' ? 5174 : 5173,
        strictPort: true,
    },
}));
