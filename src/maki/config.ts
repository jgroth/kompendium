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
    docs: JsonDocs,
    menu: MenuItem[]
}
