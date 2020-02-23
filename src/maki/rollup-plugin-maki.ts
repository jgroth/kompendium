import fs from 'fs';
import lnk from 'lnk';
import { MakiConfig, defaultConfig } from './config';

function maki(config: Partial<MakiConfig> = {}) {
    config = {
        ...defaultConfig,
        ...config
    };

    let started = false;
    const path = `${config.publicPath}/.maki`;

    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }

    return {
        name: 'rollup-plugin-maki',
        generateBundle: async function() {
            if (started) {
                return;
            }

            started = true;
            lnk([config.path], config.publicPath, { rename: '.maki' });
        }
    };
}

export default maki;
