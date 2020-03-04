import { JsonDocsProp } from "@stencil/core/internal";
import { h } from '@stencil/core';
import { ProplistItem } from "../../proplist/proplist";

export function PropertyList({props, id}: {id: string, props: JsonDocsProp[]}) {
    if (!props.length) {
        return;
    }

    return [
        <h4 id={id}>Properties</h4>,
        ...props.map(renderProperty)
    ];
}

function renderProperty(property: JsonDocsProp) {
    const items: ProplistItem[] = [{
        key: 'Type',
        value: property.type
    }, {
        key: 'Attribute name',
        value: property.attr
    }, {
        key: 'Default value',
        value: property.default
    }, {
        key: 'Optional',
        value: String(property.optional)
    }, {
        key: 'Required',
        value: String(property.required)
    }];

    return (
        <div>
            <h5>{property.name}</h5>
            <kompendium-markdown text={property.docs} />
            <kompendium-taglist tags={property.docsTags} />
            <kompendium-proplist items={items}/>
        </div>
    );
}
