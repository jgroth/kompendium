import { JsonDocsComponent, JsonDocsTag } from '@stencil/core/internal';
import { h } from '@stencil/core';

export function ExampleList({
    examples,
    id,
    schema,
}: {
    id: string;
    examples: JsonDocsComponent[];
    schema: Record<string, any>;
}): HTMLElement[] {
    if (!examples.length) {
        return;
    }

    return [
        <h3 class="docs-layout-section-heading" id={id}>
            Examples
        </h3>,
        examples.map(renderExample(schema)),
    ];
}

const renderExample =
    (schema: Record<string, any>) => (example: JsonDocsComponent) => {
        return <kompendium-playground component={example} schema={schema} />;
    };

export const isExampleTag =
    (name: string) =>
    (tag: JsonDocsTag): boolean => {
        return tag.text.startsWith(name);
    };
