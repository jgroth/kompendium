/* eslint-disable sonarjs/no-duplicate-string */
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import preferArrow from 'eslint-plugin-prefer-arrow';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});
/* eslint-enable no-underscore-dangle */

export default [
    {
        ignores: [
            '**/.kompendium/',
            '**/.github/',
            '**/.vscode/',
            '**/dist/',
            '**/node_modules/',
            '**/www/',
            '**/loader/',
        ],
    },
    ...compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
        'plugin:sonarjs/recommended',
        'plugin:jsdoc/recommended',
    ),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
            prettier: prettier,
            sonarjs: sonarjs,
            'prefer-arrow': preferArrow,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },

        settings: {
            react: {
                version: '16.14',
                pragma: 'h',
            },
        },

        rules: {
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                },
            ],

            semi: ['error', 'always'],
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],

            '@typescript-eslint/array-type': [
                'error',
                {
                    default: 'array-simple',
                },
            ],

            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/unified-signatures': 'error',
            '@typescript-eslint/no-unused-expressions': 'error',
            'no-unused-vars': 'off',
            camelcase: 'error',

            'comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    functions: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                },
            ],

            curly: 'error',
            'default-case': 'error',
            eqeqeq: ['error', 'always'],
            'guard-for-in': 'error',
            'id-match': 'error',
            'jsdoc/check-indentation': 'error',
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/no-undefined-types': 'off',
            'jsdoc/check-tag-names': 'off',
            'max-classes-per-file': ['error', 1],
            'multiline-ternary': ['error', 'never'],
            'no-bitwise': 'error',
            'no-caller': 'error',
            'no-console': 'error',
            'no-duplicate-imports': 'error',
            'no-eval': 'error',
            'no-extra-bind': 'error',

            'no-magic-numbers': [
                'off',
                {
                    ignore: [-1, 0, 1],
                    ignoreArrayIndexes: true,
                },
            ],

            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-return-await': 'error',
            'no-sequences': 'error',

            'no-shadow': [
                'off',
                {
                    hoist: 'all',
                },
            ],

            'no-template-curly-in-string': 'error',
            'no-throw-literal': 'error',
            'no-underscore-dangle': 'error',
            'no-var': 'error',
            'object-shorthand': ['error', 'never'],
            'one-var': ['error', 'never'],

            'padding-line-between-statements': [
                'error',
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'return',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'function',
                },
                {
                    blankLine: 'always',
                    prev: 'multiline-block-like',
                    next: '*',
                },
            ],

            'prefer-arrow/prefer-arrow-functions': [
                'error',
                {
                    allowStandaloneDeclarations: true,
                },
            ],

            'prefer-const': 'error',
            'prefer-object-spread': 'error',
            radix: 'error',

            'spaced-comment': [
                'error',
                'always',
                {
                    markers: ['/'],
                },
            ],
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },

        rules: {
            'no-unused-vars': 'error',
            'sonarjs/no-duplicate-string': 'off',
        },
    },
    {
        files: ['./*.ts'],

        rules: {
            'sonarjs/no-duplicate-string': 'off',
        },
    },
    {
        files: ['src/**/*.{ts,tsx}'],

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',

            parserOptions: {
                parserOption: {
                    jsx: true,
                },

                project: 'tsconfig.json',
            },
        },

        rules: {
            '@typescript-eslint/dot-notation': 'error',
        },
    },
    {
        files: [
            'src/examples/*.{ts,tsx}',
            'src/components/**/examples/*.{ts,tsx}',
            'src/components/**/examples/**/*.{ts,tsx}',
            'src/**/*.spec.{ts,tsx}',
            'src/**/*.e2e.{ts,tsx}',
            'src/**/*.test-wrapper.{ts,tsx}',
        ],

        languageOptions: {
            ecmaVersion: 5,
            sourceType: 'script',

            parserOptions: {
                parserOption: {
                    jsx: true,
                },

                project: 'tsconfig.json',
            },
        },

        rules: {
            '@typescript-eslint/dot-notation': 'error',
            'sonarjs/no-duplicate-string': 'off',
            'sonarjs/no-identical-functions': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/require-param': 'off',
            'no-console': 'off',
            'no-magic-numbers': 'off',
            'prefer-arrow/prefer-arrow-functions': 'off',
        },
    },
];
