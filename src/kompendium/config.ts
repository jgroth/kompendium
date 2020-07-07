import { JsonDocs } from '@stencil/core/internal';

export interface KompendiumConfig {
    /**
     * Output path
     */
    path: string;

    /**
     * www
     */
    publicPath: string;

    title?: string;
}

export const defaultConfig: KompendiumConfig = {
    path: '.kompendium',
    publicPath: 'www',
};

export interface MenuItem {
    title?: string;
    path: string;
    icon?: string;
    children?: MenuItem[];
}

export interface KompendiumData {
    title: string;
    docs: JsonDocs;
    menu: MenuItem[];
    readme?: string;
}
