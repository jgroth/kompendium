import { JsonDocsSlot } from "@stencil/core/internal";
import { h } from '@stencil/core';

export function SlotList({slots}: {slots: JsonDocsSlot[]}) {
    if (!slots.length) {
        return;
    }

    return [
        <h2>Slots</h2>,
        ...slots.map(renderSlot)
    ];
}

function renderSlot(slot: JsonDocsSlot) {
    return (
        <div>
            <h3>{slot.name}</h3>
            <maki-markdown text={slot.docs} />
        </div>
    );
}
