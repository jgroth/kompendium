module.exports = {
    'env': {
        'browser': true,
        'es2020': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@stencil/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 11,
        'sourceType': 'module',
        'project': './tsconfig.json'
    },
    'plugins': [
        '@typescript-eslint',
        'prettier'
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        '@stencil/decorators-style': 0,
        '@stencil/render-returns-host': 0,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-unused-vars-experimental': 'warn',
        '@stencil/strict-boolean-conditions': 0,
        'prettier/prettier': 'error',
        '@typescript-eslint/no-explicit-any': 0
    }
};
