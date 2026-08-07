import { JsonDocsComponent, JsonDocsTag } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { PropsFactory } from '../../playground/playground.types';

export function ExampleList({
    examples,
    slugs,
    id,
    slugId,
    schema,
    propsFactory,
}: {
    id?: string;
    slugId?: string;
    examples: JsonDocsComponent[];
    slugs: string[];
    schema: Record<string, any>;
    propsFactory?: PropsFactory;
}): HTMLElement[] {
    if (!examples.length) {
        return;
    }

    return [
        slugId ? (
            <span class="section-anchor" id={slugId} aria-hidden="true"></span>
        ) : null,
        <h2 class="docs-layout-section-heading" id={id}>
            Examples
            {slugId ? (
                <kompendium-anchor slug={slugId} label="Examples" />
            ) : null}
        </h2>,
        examples.map(renderExample(slugs, schema, propsFactory)),
    ];
}

const renderExample =
    (slugs: string[], schema: Record<string, any>, factory: PropsFactory) =>
    (example: JsonDocsComponent, index: number) => {
        const slug = slugs[index];

        return (
            <div class="example-wrapper" id={slug}>
                <kompendium-playground
                    anchorSlug={slug}
                    component={example}
                    schema={schema}
                    propsFactory={factory}
                />
            </div>
        );
    };

export const isExampleTag =
    (name: string) =>
    (tag: JsonDocsTag): boolean => {
        return tag.text.startsWith(name);
    };
