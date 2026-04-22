import { JsonDocsSlot } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { entrySlug } from '../anchors';

export function SlotList({
    slots,
    id,
    slugId,
}: {
    id: string;
    slugId: string;
    slots: JsonDocsSlot[];
}): HTMLElement[] {
    if (!slots.length) {
        return;
    }

    return [
        <span class="section-anchor" id={slugId} aria-hidden="true"></span>,
        <h3 class="docs-layout-section-heading" id={id}>
            Slots
            <kompendium-anchor slug={slugId} label="Slots" />
        </h3>,
        ...slots.map(renderSlot(slugId)),
    ];
}

const renderSlot = (sectionSlug: string) => (slot: JsonDocsSlot) => {
    const slug = sectionSlug ? entrySlug(sectionSlug, slot.name) : null;

    return (
        <div>
            <h4 id={slug}>
                {slot.name}
                {slug ? (
                    <kompendium-anchor slug={slug} label={slot.name} />
                ) : null}
            </h4>
            <kompendium-markdown text={slot.docs} />
        </div>
    );
};
