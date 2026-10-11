import { JsonDocsEvent } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { ProplistItem } from '../../proplist/proplist';
import { entrySlug } from '../anchors';

export function EventList({
    events,
    id,
    slugId,
}: {
    id?: string;
    slugId?: string;
    events: JsonDocsEvent[];
}): HTMLElement[] {
    if (!events.length) {
        return;
    }

    return [
        slugId ? (
            <span class="section-anchor" id={slugId} aria-hidden="true"></span>
        ) : null,
        <h3 class="docs-layout-section-heading" id={id}>
            Events
            {slugId ? <kompendium-anchor slug={slugId} label="Events" /> : null}
        </h3>,
        ...events.map(renderEvent(slugId)),
    ];
}

const renderEvent =
    (sectionSlug: string | undefined) => (event: JsonDocsEvent) => {
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

        const slug = sectionSlug ? entrySlug(sectionSlug, event.event) : null;

        return (
            <div class="props-events-layout">
                <h4 id={slug}>
                    {event.event}
                    {slug ? (
                        <kompendium-anchor slug={slug} label={event.event} />
                    ) : null}
                </h4>
                <kompendium-taglist tags={event.docsTags} />
                <div class="markdown-props">
                    <kompendium-markdown text={event.docs} />
                    <kompendium-proplist items={items} />
                </div>
            </div>
        );
    };
