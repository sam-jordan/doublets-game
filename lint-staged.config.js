const lintstagedConfig = {
    '*.{js,ts,tsx}': ['xo --fix', 'prettier --write'],
    'package.json': ['prettier --write', 'sort-package-json'],
    '*.{yml,md}': ['prettier --write'],
};

export default lintstagedConfig;
