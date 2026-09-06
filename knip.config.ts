import { defineConfig } from 'knip/config';

export default defineConfig({
    entry: [
        'backend/stack/deploy.ts',
        'backend/lambda/auto-confirm/index.ts',
        'backend/lambda/stats-api/index.ts',
        'frontend/src/styles.css',
        'scripts/convert-words-to-json.ts',
        'scripts/find-linked-words.ts',
        'scripts/generate-puzzles.ts',
        'scripts/solve-puzzle.ts',
    ],
    project: ['**/*.{tsx,ts,css}'],
});
