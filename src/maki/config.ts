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
