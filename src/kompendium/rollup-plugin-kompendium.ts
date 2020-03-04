import fs from 'fs';
import lnk from 'lnk';
import { KompendiumConfig, defaultConfig } from './config';

function kompendium(config: Partial<KompendiumConfig> = {}) {
    config = {
        ...defaultConfig,
        ...config
    };

    let started = false;
    const path = `${config.publicPath}/.kompendium`;

    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }

    return {
        name: 'rollup-plugin-kompendium',
        generateBundle: async function() {
            if (started) {
                return;
            }

            started = true;
            lnk([config.path], config.publicPath, { rename: '.kompendium' });
        }
    };
}

export default kompendium;
