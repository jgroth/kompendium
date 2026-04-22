import { JsonDocsProp } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { ProplistItem } from '../../proplist/proplist';
import { entrySlug } from '../anchors';

export function PropertyList({
    props,
    id,
    slugId,
}: {
    id?: string;
    slugId?: string;
    props: Array<Partial<JsonDocsProp>>;
}): HTMLElement[] {
    if (!props.length) {
        return;
    }

    return [
        <span class="section-anchor" id={slugId} aria-hidden="true"></span>,
        <h3 class="docs-layout-section-heading" id={id}>
            Properties
            <kompendium-anchor slug={slugId} label="Properties" />
        </h3>,
        ...props.map(renderProperty(slugId)),
    ];
}

const renderProperty = (sectionSlug: string) => (property: JsonDocsProp) => {
    const items: ProplistItem[] = [
        {
            key: 'Type',
            value: property.type,
        },
        {
            key: 'Attribute name',
            value: property.attr,
        },
        {
            key: 'Default value',
            value: property.default,
        },
        {
            key: 'Optional',
            value: String(property.optional),
        },
        {
            key: 'Required',
            value: String(property.required),
        },
    ].filter((item) => item.value !== undefined && item.value !== 'undefined');

    const slug = sectionSlug ? entrySlug(sectionSlug, property.name) : null;

    return (
        <div class="props-events-layout">
            <h4 id={slug}>
                {property.name}
                {slug ? (
                    <kompendium-anchor slug={slug} label={property.name} />
                ) : null}
            </h4>
            <kompendium-taglist tags={property.docsTags} />
            <div class="markdown-props">
                <kompendium-markdown text={property.docs} />
                <kompendium-proplist items={items} />
            </div>
        </div>
    );
};
