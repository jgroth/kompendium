import { Config } from '@stencil/core';
import { kompendium } from './src/kompendium';
import { sass } from '@stencil/sass';
import nodePolyfill from 'rollup-plugin-node-polyfills';
import kompendiumPlugin from './src/kompendium/rollup-plugin-kompendium';

export const config: Config = {
    namespace: 'kompendium',
    plugins: [sass(), nodePolyfill(), kompendiumPlugin()],
    globalStyle: 'src/global/kompendium.scss',

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
            generator: kompendium()
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
