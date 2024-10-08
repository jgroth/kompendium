import { Config } from '@stencil/core';
import { kompendium } from './src/kompendium';
import { sass } from '@stencil/sass';
import nodePolyfill from 'rollup-plugin-node-polyfills';
import guides from './guides';

export const config: Config = {
    namespace: 'kompendium',
    plugins: [sass()],
    rollupPlugins: {
        after: [nodePolyfill()],
    },
    nodeResolve: {
        preferBuiltins: true,
    },
    globalStyle: 'src/global/kompendium.scss',

    outputTargets: [
        {
            type: 'dist',
            esmLoaderPath: '../loader',
        },
        {
            type: 'docs-custom',
            strict: true,
            generator: kompendium({
                guides: guides,
                logo: '/collection/assets/logotype.svg',
            }),
        },
        {
            type: 'www',
            serviceWorker: null,
            copy: [
                {
                    src: 'assets',
                    dest: './collection/assets',
                },
            ],
        },
    ],
    testing: {
        moduleNameMapper: {
            "^typedoc$": "<rootDir>/node_modules/typedoc/dist/index.js"
        }
    },
};
