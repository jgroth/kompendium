import { JsonDocs, JsonDocsComponent } from "@stencil/core/internal";
import fs from "fs";

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

    return [{
        type: 'tsx',
        source
    }];
}

function readFile(filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (error, data) => {
            if (error) {
                reject(error);
            }

            resolve(data);
        });
    });
}
