import { JsonDocsComponent, JsonDocsTag } from '@stencil/core/internal';
import { h } from '@stencil/core';

export function ExampleList({
    examples,
    id,
    tags,
}: {
    id: string;
    examples: JsonDocsComponent[];
    tags: JsonDocsTag[];
}): HTMLElement[] {
    if (!examples.length) {
        return;
    }

    return [<h4 id={id}>Examples</h4>, examples.map(renderExample(tags))];
}

const renderExample = (tags: JsonDocsTag[]) => (example: JsonDocsComponent) => {
    const text = getExampleText(tags, example.tag);
    return [
        <kompendium-markdown text={text} />,
        <kompendium-playground component={example} />,
    ];
};

function getExampleText(tags: JsonDocsTag[], tagName: string) {
    const tag = tags.find(isExampleTag(tagName));
    if (!tag) {
        return '';
    }

    return tag.text.replace(tagName, '').trim();
}

export const isExampleTag = (name: string) => (tag: JsonDocsTag): boolean => {
    return tag.text.startsWith(name);
};
