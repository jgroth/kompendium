import { JsonDocs } from "@stencil/core/internal";
import fs from 'fs';
import { MakiConfig, defaultConfig } from "./config";


export const maki = (config: Partial<MakiConfig> = {}) => (docs: JsonDocs): void | Promise<void> => {
    config = {
        ...defaultConfig,
        ...config
    };

    return new Promise<void>(writeData(config.path, docs));
}

const writeData = (path: string, docs: JsonDocs) => (resolve: () => void) => {
    const filePath = `${path}/maki.json`;

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    const data = JSON.stringify(docs);
    fs.writeFile(filePath, data, 'utf8', resolve);
}
