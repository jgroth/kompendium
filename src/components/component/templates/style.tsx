import { JsonDocsStyle } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { entrySlug } from '../anchors';

export function StyleList({
    styles,
    id,
    slugId,
}: {
    id?: string;
    slugId?: string;
    styles: JsonDocsStyle[];
}): HTMLElement[] {
    if (!styles.length) {
        return;
    }

    return [
        slugId ? (
            <span class="section-anchor" id={slugId} aria-hidden="true"></span>
        ) : null,
        <h3 class="docs-layout-section-heading" id={id}>
            Styles
            {slugId ? <kompendium-anchor slug={slugId} label="Styles" /> : null}
        </h3>,
        ...styles.map(renderStyle(slugId)),
    ];
}

const renderStyle =
    (sectionSlug: string | undefined) => (style: JsonDocsStyle) => {
        const slug = sectionSlug ? entrySlug(sectionSlug, style.name) : null;

        return (
            <div class="styles-layout">
                <div class="styles-title" id={slug}>
                    <code>{style.name}</code>
                    {slug ? (
                        <kompendium-anchor slug={slug} label={style.name} />
                    ) : null}
                </div>
                <div class="styles-content">
                    <kompendium-markdown text={style.docs} />
                </div>
            </div>
        );
    };
