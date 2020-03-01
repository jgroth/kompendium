import { Config } from '@stencil/core';
import { maki } from './src/maki';
import { sass } from '@stencil/sass';
import nodePolyfill from 'rollup-plugin-node-polyfills';
import makiPlugin from './src/maki/rollup-plugin-maki';

export const config: Config = {
    namespace: 'maki',
    plugins: [sass(), nodePolyfill(), makiPlugin()],
    globalStyle: 'src/global/maki.css',

    outputTargets: [
        {
            type: 'dist',
            esmLoaderPath: '../loader',
            copy: [{
                src: '../node_modules/@fortawesome/fontawesome-free/webfonts/',
                dest: 'fonts',
                warn: true
            }]
        },
        {
            type: 'docs-custom',
            strict: true,
            generator: maki()
        },
        {
            type: 'www',
            serviceWorker: null,
            copy: [{
                src: '../node_modules/@fortawesome/fontawesome-free/webfonts/',
                dest: 'fonts',
                warn: true
            }]
        }
    ]
};
