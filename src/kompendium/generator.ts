import { JsonDocs, JsonDocsComponent } from "@stencil/core/internal";
import fs from 'fs';
import { KompendiumConfig, defaultConfig, KompendiumData, MenuItem } from "./config";


export const kompendium = (config: Partial<KompendiumConfig> = {}) => (docs: JsonDocs): void | Promise<void> => {
    config = {
        ...defaultConfig,
        ...config
    };

    const data: KompendiumData = {
        docs,
        title: getProjectTitle(config),
        menu: createMenu(docs)
    };

    return new Promise<void>(writeData(config.path, data));
}

export function createMenu(docs: JsonDocs): MenuItem[] {
    return [
        createGuideMenu(),
        createComponentMenu(docs),
        createApiMenu(),
        createVersionMenu()
    ];
}

export function createGuideMenu(): MenuItem {
    return {
        path: '/guide',
        icon: 'book'
    };
}

export function createComponentMenu(docs: JsonDocs): MenuItem {
    return {
        path: '/component',
        icon: 'cubes',
        children: docs.components.map(getComponentMenu)
    };
}

export function getComponentMenu(component: JsonDocsComponent): MenuItem {
    return {
        path: `/component/${component.tag}`,
        title: getComponentTitle(component.tag),
        children: [
            getComponentPropertyMenu(component),
            getComponentEventMenu(component),
            getComponentMethodMenu(component),
            getComponentSlotMenu(component),
            getComponentStyleMenu(component),
        ].filter(item => !!item)
    }
}


function getComponentPropertyMenu(component: JsonDocsComponent): MenuItem {
    if (!component.props.length) {
        return;
    }

    return {
        title: 'Properties',
        path: `/component/${component.tag}/properties`
    }
}

function getComponentEventMenu(component: JsonDocsComponent): MenuItem {
    if (!component.events.length) {
        return;
    }

    return {
        title: 'Events',
        path: `/component/${component.tag}/events`
    }
}

function getComponentMethodMenu(component: JsonDocsComponent): MenuItem {
    if (!component.methods.length) {
        return;
    }

    return {
        title: 'Methods',
        path: `/component/${component.tag}/methods`
    }
}

function getComponentSlotMenu(component: JsonDocsComponent): MenuItem {
    if (!component.slots.length) {
        return;
    }

    return {
        title: 'Slots',
        path: `/component/${component.tag}/slots`
    }
}

function getComponentStyleMenu(component: JsonDocsComponent): MenuItem {
    if (!component.styles.length) {
        return;
    }

    return {
        title: 'Styles',
        path: `/component/${component.tag}/styles`
    }
}


export function getComponentTitle(tag: string) {
    const title = tag.split('-').slice(1).join(' ');
    return title[0].toLocaleUpperCase() + title.slice(1);
}

export function createApiMenu(): MenuItem {
    return {
        path: '/api',
        icon: 'code'
    }
}

export function createVersionMenu(): MenuItem {
    return {
        path: '/version',
        icon: 'code-branch'
    }
}

function getProjectTitle(config: Partial<KompendiumConfig>): string {
    if (config.title) {
        return config.title;
    }

    const json = fs.readFileSync('./package.json', 'utf8');
    const data = JSON.parse(json);

    return data.name.split('-').join(' ');
}

const writeData = (path: string, data: KompendiumData) => (resolve: () => void) => {
    const filePath = `${path}/kompendium.json`;

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    fs.writeFile(filePath, JSON.stringify(data), 'utf8', resolve);
}
