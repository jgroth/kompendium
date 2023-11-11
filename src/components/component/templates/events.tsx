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

    return [
        <h2 class="docs-layout-section-heading" id={id}>
            Events
        </h2>,
        ...events.map(renderEvent),
    ];
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
        <div class="props-events-layout">
            <h3>{event.event}</h3>
            <kompendium-taglist tags={event.docsTags} />
            <div class="markdown-props">
                <kompendium-markdown text={event.docs} />
                <kompendium-proplist items={items} />
            </div>
        </div>
    );
}
