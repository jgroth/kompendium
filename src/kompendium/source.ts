import { JsonDocs, JsonDocsComponent } from "@stencil/core/internal";
import { readFile } from "./filesystem";

export interface JsonDocsSource {
    type: 'tsx' | 'scss' | 'less' | 'css';
    source: string;
}

export async function addSources(docs: JsonDocs): Promise<JsonDocs> {
    const components = await Promise.all(docs.components.map(addComponentSources));

    return {
        ...docs,
        components
    }
}

export async function addComponentSources(component: JsonDocsComponent) {
    const sources = await getSources(component);

    return {
        ...component,
        sources: sources
    }
}

export async function getSources(component: JsonDocsComponent): Promise<JsonDocsSource[]> {
    const source = await readFile(component.filePath);
    const styleNames = getStyleFiles(source);
    const styles = await Promise.all(styleNames.map(getStyle(component.dirPath)));

    return [{
        type: 'tsx',
        source
    },...styles];
}

export function getStyleFiles(source: string) {
    const result = [];
    let regex = /@Component\((\{.+?\})\)/s;
    let match = regex.exec(source);
    const config = match && match[1];

    if (!config) {
        return result;
    }

    regex = /styleUrl:.+?['"](.+?)['"]/s;
    match = regex.exec(config);

    if (match && match[1]) {
        result.push(match[1]);
    }

    console.log( result)
    return result;
}

const getStyle = (path: string) => async (name: string): Promise<JsonDocsSource> => {
    const source = await readFile([path, name].join('/'));
    return {
        type: 'scss',
        source: source
    };
};
