import { JsonDocsEvent, JsonDocsMethod } from "@stencil/core/internal";
import { h } from '@stencil/core';
import { ProplistItem } from "../../proplist/proplist";

export function MethodList({methods}: {methods: JsonDocsMethod[]}) {
    if (!methods.length) {
        return;
    }

    return [
        <h2>Methods</h2>,
        ...methods.map(renderMethod)
    ];
}

function renderMethod(method: JsonDocsMethod) {
    const items: ProplistItem[] = [{
        key: 'Signature',
        value: <code>{method.signature}</code>
    }];

    return (
        <div>
            <h3>{method.name}</h3>
            <maki-taglist tags={method.docsTags} />
            <maki-markdown text={method.docs} />
            <maki-proplist items={items}/>
        </div>
    );
}
