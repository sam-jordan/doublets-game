import { type FlatXoConfig } from 'xo';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import xoReact from 'eslint-config-xo-react';
import { fixupConfigRules } from '@eslint/compat';

const xoConfig: FlatXoConfig = [
    // https://github.com/xojs/xo#react
    ...fixupConfigRules(xoReact()),
    jsxA11y.flatConfigs.recommended,
    {
        files: '**/*.{js,ts,tsx,html}',
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
            '@html-eslint/require-open-graph-protocol': 'off',
            'react/jsx-no-bind': 'off',
        },
    },
];

export default xoConfig;
