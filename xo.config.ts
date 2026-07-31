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
                project: [
                    './tsconfig.app.json',
                    './tsconfig.configs.json',
                    './tsconfig.node.json',
                ],
            },
        },
        rules: {
            // Needed for AWS CDK
            'no-new': 'off',

            // Annoying
            '@eslint-community/eslint-comments/require-description': 'off',
            '@typescript-eslint/naming-convention': 'off',
        },
    },
];

export default xoConfig;
