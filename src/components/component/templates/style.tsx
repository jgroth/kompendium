import { JsonDocsStyle } from "@stencil/core/internal";
import { h } from '@stencil/core';

export function StyleList({styles, id}: {id: string, styles: JsonDocsStyle[]}) {
    if (!styles.length) {
        return;
    }

    return [
        <h4 id={id}>Styles</h4>,
        ...styles.map(renderStyle)
    ];
}

function renderStyle(style: JsonDocsStyle) {
    return (
        <div>
            <h5>{style.name}</h5>
            <kompendium-markdown text={style.docs} />
        </div>
    );
}
