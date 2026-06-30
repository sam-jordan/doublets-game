import { type FlatXoConfig } from 'xo';

const xoConfig: FlatXoConfig = [
    {
        files: '**/*.{ts,tsx}',
        space: true,
        prettier: true,
        languageOptions: {
            parserOptions: {
                projectService: false,
                project: ['./tsconfig.app.json', './tsconfig.node.json'],
            },
        },
    },
];

export default xoConfig;
