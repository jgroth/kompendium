import { JsonDocsSlot } from "@stencil/core/internal";
import { h } from '@stencil/core';

export function SlotList({slots, id}: {id: string, slots: JsonDocsSlot[]}) {
    if (!slots.length) {
        return;
    }

    return [
        <h4 id={id}>Slots</h4>,
        ...slots.map(renderSlot)
    ];
}

function renderSlot(slot: JsonDocsSlot) {
    return (
        <div>
            <h5>{slot.name}</h5>
            <maki-markdown text={slot.docs} />
        </div>
    );
}
