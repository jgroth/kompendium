import { JsonDocsComponent, JsonDocsTag } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { PropsFactory } from '../../playground/playground.types';

export function ExampleList({
    examples,
    id,
    schema,
    propsFactory,
}: {
    id: string;
    examples: JsonDocsComponent[];
    schema: Record<string, any>;
    propsFactory?: PropsFactory;
}): HTMLElement[] {
    if (!examples.length) {
        return;
    }

    return [
        <h3 class="docs-layout-section-heading" id={id}>
            Examples
        </h3>,
        examples.map(renderExample(schema, propsFactory)),
    ];
}

const renderExample =
    (schema: Record<string, any>, factory: PropsFactory) =>
    (example: JsonDocsComponent) => {
        return (
            <kompendium-playground
                component={example}
                schema={schema}
                propsFactory={factory}
            />
        );
    };

export const isExampleTag =
    (name: string) =>
    (tag: JsonDocsTag): boolean => {
        return tag.text.startsWith(name);
    };
