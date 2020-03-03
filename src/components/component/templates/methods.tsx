import { JsonDocsMethod } from "@stencil/core/internal";
import { h } from '@stencil/core';
import { ProplistItem } from "../../proplist/proplist";

export function MethodList({methods, id}: {id: string, methods: JsonDocsMethod[]}) {
    if (!methods.length) {
        return;
    }

    return [
        <h4 id={id}>Methods</h4>,
        ...methods.map(renderMethod)
    ];
}

function renderMethod(method: JsonDocsMethod) {
    const items: ProplistItem[] = [{
        key: 'Signature',
        value: method.signature
    }];

    return (
        <div>
            <h5>{method.name}</h5>
            <maki-markdown text={method.docs} />
            <maki-taglist tags={method.docsTags} />
            <maki-proplist items={items}/>
        </div>
    );
}
