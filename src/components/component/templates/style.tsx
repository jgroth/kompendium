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

    return [<h3 id={id}>Styles</h3>, ...styles.map(renderStyle)];
}

function renderStyle(style: JsonDocsStyle) {
    return (
        <div>
            <h4>{style.name}</h4>
            <kompendium-markdown text={style.docs} />
        </div>
    );
}
