import { JsonDocsProp } from "@stencil/core/internal";
import { h } from '@stencil/core';
import { ProplistItem } from "../../proplist/proplist";

export function PropertyList({props}: {props: JsonDocsProp[]}) {
    if (!props.length) {
        return;
    }

    return [
        <h2>Properties</h2>,
        ...props.map(renderProperty)
    ];
}

function renderProperty(property: JsonDocsProp) {
    const items: ProplistItem[] = [{
        key: 'Type',
        value: <code>{property.type}</code>
    }, {
        key: 'Attribute name',
        value: <code>{property.attr}</code>
    }, {
        key: 'Default value',
        value: <code>{property.default}</code>
    }, {
        key: 'Optional',
        value: <code>{String(property.optional)}</code>
    }, {
        key: 'Required',
        value: <code>{String(property.required)}</code>
    }];

    return (
        <div>
            <h3>{property.name}</h3>
            <maki-taglist tags={property.docsTags} />
            <maki-markdown text={property.docs} />
            <maki-proplist items={items}/>
        </div>
    );
}
