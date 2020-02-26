import { JsonDocsEvent } from "@stencil/core/internal";
import { h } from '@stencil/core';
import { ProplistItem } from "../../proplist/proplist";

export function EventList({events}: {events: JsonDocsEvent[]}) {
    if (!events.length) {
        return;
    }

    return [
        <h2>Events</h2>,
        ...events.map(renderEvent)
    ];
}

function renderEvent(event: JsonDocsEvent) {
    const items: ProplistItem[] = [{
        key: 'Detail',
        value: <code>{event.detail}</code>
    }, {
        key: 'Bubbles',
        value: <code>{String(event.bubbles)}</code>
    }, {
        key: 'Cancelable',
        value: <code>{String(event.cancelable)}</code>
    }, {
        key: 'Composed',
        value: <code>{String(event.composed)}</code>
    }];

    return (
        <div>
            <h3>{event.event}</h3>
            <maki-taglist tags={event.docsTags} />
            <maki-markdown text={event.docs} />
            <maki-proplist items={items}/>
        </div>
    );
}
