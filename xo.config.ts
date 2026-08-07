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

            // Does not align with desired style
            'react/jsx-no-bind': 'off',

            // Conflicts with Prettier, which has no config option for this
            '@stylistic/no-mixed-operators': 'off',
        },
    },
];

export default xoConfig;
