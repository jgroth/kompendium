import { JsonDocs } from '@stencil/core/internal';
import { defaultConfig } from './config';
import { addSources } from './source';
import lnk from 'lnk';
import { createMenu } from './menu';
import { exists, mkdir, readFile, writeFile, stat } from './filesystem';
import { createWatcher } from './watch';
import { findGuides } from './guides';
import { KompendiumConfig, KompendiumData, TypeDescription } from '../types';
import { parseFile } from './typedoc';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const kompendium = (config: Partial<KompendiumConfig> = {}) => {
    if (!generateDocs()) {
        return () => null;
    }

    return kompendiumGenerator(config);
};

export function kompendiumGenerator(
    config: Partial<KompendiumConfig>
): (docs: JsonDocs) => Promise<void> {
    config = {
        ...defaultConfig,
        ...config,
    };
    initialize(config);

    return async (docs: JsonDocs) => {
        console.time('kompendium');

        const [jsonDocs, title, readme, guides, types] = await Promise.all([
            addSources(docs),
            getProjectTitle(config),
            getReadme(),
            findGuides(config),
            getTypes(config),
        ]);

        const data: KompendiumData = {
            docs: jsonDocs,
            title: title,
            menu: createMenu(docs, guides, types),
            readme: readme,
            guides: guides,
            types: types,
        };

        await writeData(config, data);

        console.timeEnd('kompendium');
    };
}

async function initialize(config: Partial<KompendiumConfig>) {
    const path = `${config.publicPath}/kompendium.json`;

    if (isWatcher()) {
        createWatcher(path, 'unlink', onUnlink(config));
    }

    await createOutputDir(config);
}

const onUnlink = (config: Partial<KompendiumConfig>) => () => {
    createSymlink(config);
};

async function createSymlink(config: Partial<KompendiumConfig>) {
    const source = `${config.path}/kompendium.json`;
    const target = `${config.publicPath}/kompendium.json`;

    if (!(await exists(source))) {
        return;
    }

    if (await exists(target)) {
        return;
    }

    lnk([source], config.publicPath);
}

async function getProjectTitle(
    config: Partial<KompendiumConfig>
): Promise<string> {
    if (config.title) {
        return config.title;
    }

    const json = await readFile('./package.json');
    const data = JSON.parse(json);

    return data.name
        .replace(/^@[^/]+?\//, '')
        .split('-')
        .join(' ');
}

async function writeData(
    config: Partial<KompendiumConfig>,
    data: KompendiumData
) {
    let filePath = `${config.path}/kompendium.json`;

    if (isProd()) {
        filePath = `${config.publicPath}/kompendium.json`;
    }

    await writeFile(filePath, JSON.stringify(data));

    if (isWatcher()) {
        createSymlink(config);
    }
}

async function createOutputDir(config: Partial<KompendiumConfig>) {
    let path = config.path;

    if (isProd()) {
        path = config.publicPath;
    }

    if (!(await exists(path))) {
        mkdir(path, { recursive: true });
    }
}

async function getReadme(): Promise<string> {
    const files = ['readme.md', 'README.md', 'README', 'readme'];
    let data = null;

    for (const file of files) {
        if (data) {
            continue;
        }

        if (!(await exists(file))) {
            continue;
        }

        data = await readFile(file);
    }

    if (!data) {
        console.log('README did not exist');
    }

    return data;
}

function generateDocs(): boolean {
    return !!process.argv.includes('--docs');
}

function isWatcher(): boolean {
    return !!process.argv.includes('--watch');
}

function isProd(): boolean {
    if (process.argv.includes('--dev')) {
        return false;
    }

    if (process.argv.includes('test')) {
        return false;
    }

    if (process.argv.find((arg) => arg.includes('jest-worker'))) {
        return false;
    }

    return true;
}

async function getTypes(
    config: Partial<KompendiumConfig>
): Promise<TypeDescription[]> {
    console.log('Getting type information...');
    let types = await readTypes(config);
    const cache = await readCache(config);

    if (types.length === 0 || (await isModified(types, cache))) {
        console.log('Parsing types...');
        const data = parseFile(config.typeRoot);
        await saveData(config, data);
        types = data;
    }

    return types;
}

async function isModified(types: any[], cache: Record<string, number>) {
    if (Object.keys(cache).length === 0) {
        return true;
    }

    let filenames = types.map((t) => t.sources).flat();
    filenames = [...new Set(filenames)];

    const stats = await Promise.all(filenames.map(stat));

    return stats.some((data, index) => {
        const filename = filenames[index];
        const result = cache[filename] !== data.mtimeMs;

        console.log(`${filename} was ${result ? '' : 'not'} modified!`);

        return result;
    });
}

async function saveData(
    config: Partial<KompendiumConfig>,
    types: TypeDescription[]
) {
    let filenames = types.map((t) => t.sources).flat();
    filenames = [...new Set(filenames)];

    const stats = await Promise.all(filenames.map(stat));

    const cache = {};
    stats.forEach((data, index) => {
        const filename = filenames[index];
        cache[filename] = data.mtimeMs;
    });

    await Promise.all([writeCache(config, cache), writeTypes(config, types)]);
}

async function readCache(config: Partial<KompendiumConfig>) {
    try {
        const data = await readFile(`${config.path}/cache.json`);
        return JSON.parse(data);
    } catch {
        return {};
    }
}

async function writeCache(config: Partial<KompendiumConfig>, data: any) {
    await writeFile(`${config.path}/cache.json`, JSON.stringify(data));
}

async function readTypes(config: Partial<KompendiumConfig>) {
    try {
        const data = await readFile(`${config.path}/types.json`);
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function writeTypes(config: Partial<KompendiumConfig>, data: any) {
    await writeFile(`${config.path}/types.json`, JSON.stringify(data));
}
