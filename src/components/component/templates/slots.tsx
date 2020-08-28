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

    return [<h3 class="docs-layout-section-heading" id={id}>Slots</h3>, ...slots.map(renderSlot)];
}

function renderSlot(slot: JsonDocsSlot) {
    return (
        <div>
            <h4>{slot.name}</h4>
            <kompendium-markdown text={slot.docs} />
        </div>
    );
}
