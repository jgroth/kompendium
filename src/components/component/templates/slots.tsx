import { JsonDocsSlot } from '@stencil/core/internal';
import { h } from '@stencil/core';

export function SlotList({
    slots,
    id,
}: {
    id: string;
    slots: JsonDocsSlot[];
}): HTMLElement[] {
    if (!slots.length) {
        return;
    }

    return [
        <h2 class="docs-layout-section-heading" id={id}>
            Slots
        </h2>,
        ...slots.map(renderSlot),
    ];
}

function renderSlot(slot: JsonDocsSlot) {
    return (
        <div>
            <h3>{slot.name}</h3>
            <kompendium-markdown text={slot.docs} />
        </div>
    );
}
