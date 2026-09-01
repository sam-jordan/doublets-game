import process from 'node:process';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, `${process.cwd()}/frontend`, '');

    return {
        plugins: [react(), tailwindcss()],
        test: {
            environment: 'jsdom',
            include: ['**/*.test.{tsx,ts}'],
        },
        root: mode === 'test' ? '.' : 'frontend',
        build: {
            outDir: 'build',
        },
        server: {
            // Caching is disabled on port 5173 only
            port: mode === 'cache' ? 5174 : 5173,
            strictPort: true,
            proxy: {
                '/stats': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});
