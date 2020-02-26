import { JsonDocsStyle } from "@stencil/core/internal";
import { h } from '@stencil/core';

export function StyleList({slots: styles}: {slots: JsonDocsStyle[]}) {
    if (!styles.length) {
        return;
    }

    return [
        <h2>Styles</h2>,
        ...styles.map(renderStyle)
    ];
}

function renderStyle(style: JsonDocsStyle) {
    return (
        <div>
            <h3>{style.name}</h3>
            <maki-markdown text={style.docs} />
        </div>
    );
}
