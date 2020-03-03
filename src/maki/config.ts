import { JsonDocs } from "@stencil/core/internal";

export interface MakiConfig {
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

export const defaultConfig: MakiConfig = {
    path: '.maki',
    publicPath: 'www'
};

export interface MenuItem {
    title?: string;
    path: string;
    icon?: string;
    children?: MenuItem[];
}

export interface MakiData {
    title: string;
    docs: JsonDocs;
    menu: MenuItem[];
}
