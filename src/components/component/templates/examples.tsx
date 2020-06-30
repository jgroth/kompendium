import { JsonDocsComponent } from "@stencil/core/internal";
import { h } from '@stencil/core';

export function ExampleList({examples, id, component}: {id: string, examples: JsonDocsComponent[], component: JsonDocsComponent}) {
    if (!examples.length) {
        return;
    }

    return [
        <h4 id={id}>Examples</h4>,
        <ul>
            {examples.map(renderExample(component))}
        </ul>
    ];
}

const renderExample = (component: JsonDocsComponent) => (example: JsonDocsComponent) => {
    const titleTag = example.docsTags.find(tag => tag.name === 'title');
    const title = titleTag?.text || example.tag;
    const href = `#/component/${component.tag}/${example.tag}`;

    return (
        <a href={href}>
            {title}
        </a>
    );
}
