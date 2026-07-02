import { type FlatXoConfig } from 'xo';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const xoConfig: FlatXoConfig = [
    jsxA11y.flatConfigs.recommended,
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
            '@eslint-community/eslint-comments/require-description': 'off',
        },
    },
];

export default xoConfig;
