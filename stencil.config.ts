import { Config } from '@stencil/core';
import { maki } from './src/maki';
import { sass } from '@stencil/sass';
import nodePolyfill from 'rollup-plugin-node-polyfills';
import makiPlugin from './src/maki/rollup-plugin-maki';

export const config: Config = {
    namespace: 'maki',
    plugins: [sass(), nodePolyfill(), makiPlugin()],

    outputTargets: [
        {
            type: 'dist',
            esmLoaderPath: '../loader'
        },
        {
            type: 'docs-custom',
            strict: true,
            generator: maki()
        },
        {
            type: 'www',
            serviceWorker: null // disable service workers
        }
    ]
};
