import { JsonDocsEvent } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { ProplistItem } from '../../proplist/proplist';

export function EventList({
    events,
    id,
}: {
    id: string;
    events: JsonDocsEvent[];
}): HTMLElement[] {
    if (!events.length) {
        return;
    }

    return [<h4 id={id}>Events</h4>, ...events.map(renderEvent)];
}

function renderEvent(event: JsonDocsEvent) {
    const items: ProplistItem[] = [
        {
            key: 'Detail',
            value: event.detail,
        },
        {
            key: 'Bubbles',
            value: String(event.bubbles),
        },
        {
            key: 'Cancelable',
            value: String(event.cancelable),
        },
        {
            key: 'Composed',
            value: String(event.composed),
        },
    ];

    return (
        <div>
            <h5>{event.event}</h5>
            <kompendium-markdown text={event.docs} />
            <kompendium-taglist tags={event.docsTags} />
            <kompendium-proplist items={items} />
        </div>
    );
}
