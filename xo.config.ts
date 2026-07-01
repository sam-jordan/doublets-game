import { type FlatXoConfig } from 'xo';

const xoConfig: FlatXoConfig = [
    {
        files: '**/*.{js,ts,tsx}',
        space: 4,
        prettier: 'compat',
        languageOptions: {
            parserOptions: {
                projectService: false,
                project: ['./tsconfig.app.json', './tsconfig.node.json'],
            },
        },
        rules: {
            // Unavoidable part of declaring Zod schemas
            'unicorn/max-nested-calls': 'warn',
        },
    },
];

export default xoConfig;
