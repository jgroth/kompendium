import { JsonDocs, JsonDocsComponent } from "@stencil/core/internal";
import fs from 'fs';
import { MakiConfig, defaultConfig, MakiData, MenuItem } from "./config";


export const maki = (config: Partial<MakiConfig> = {}) => (docs: JsonDocs): void | Promise<void> => {
    config = {
        ...defaultConfig,
        ...config
    };

    const data: MakiData = {
        docs,
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
    return {
        title: 'Properties',
        path: `/component/${component.tag}/properties`
    }
}

function getComponentEventMenu(component: JsonDocsComponent): MenuItem {
    return {
        title: 'Events',
        path: `/component/${component.tag}/events`
    }
}

function getComponentMethodMenu(component: JsonDocsComponent): MenuItem {
    return {
        title: 'Methods',
        path: `/component/${component.tag}/methods`
    }
}

function getComponentSlotMenu(component: JsonDocsComponent): MenuItem {
    return {
        title: 'Slots',
        path: `/component/${component.tag}/slots`
    }
}

function getComponentStyleMenu(component: JsonDocsComponent): MenuItem {
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

const writeData = (path: string, data: MakiData) => (resolve: () => void) => {
    const filePath = `${path}/maki.json`;

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    fs.writeFile(filePath, JSON.stringify(data), 'utf8', resolve);
}
