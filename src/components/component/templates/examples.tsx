import { JsonDocsComponent, JsonDocsTag } from '@stencil/core/internal';
import { h } from '@stencil/core';

export function ExampleList({
    examples,
    id,
}: {
    id: string;
    examples: JsonDocsComponent[];
}): HTMLElement[] {
    if (!examples.length) {
        return;
    }

    return [<h4 id={id}>Examples</h4>, examples.map(renderExample)];
}

const renderExample = (example: JsonDocsComponent) => {
    return <kompendium-playground component={example} />;
};

export const isExampleTag = (name: string) => (tag: JsonDocsTag): boolean => {
    return tag.text.startsWith(name);
};
