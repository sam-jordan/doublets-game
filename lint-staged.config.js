const lintstagedConfig = {
    '*.{js,ts,tsx}': ['xo --fix', 'prettier . --write'],
    'package.json': ['prettier . --write', 'sort-package-json'],
};

export default lintstagedConfig;
