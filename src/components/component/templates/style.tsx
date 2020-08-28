import { JsonDocsStyle } from '@stencil/core/internal';
import { h } from '@stencil/core';

export function StyleList({
    styles,
    id,
}: {
    id: string;
    styles: JsonDocsStyle[];
}): HTMLElement[] {
    if (!styles.length) {
        return;
    }

    return [<h3 class="docs-layout-section-heading" id={id}>Styles</h3>, ...styles.map(renderStyle)];
}

function renderStyle(style: JsonDocsStyle) {
    return (
        <div class="styles-layout">
            <div class="styles-title"><code>{style.name}</code></div>
            <div class="styles-content">
                <kompendium-markdown text={style.docs} />
            </div>
        </div>
    );
}
