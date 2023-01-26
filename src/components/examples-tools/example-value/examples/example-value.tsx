import { Component, h } from '@stencil/core';

const code = true;

@Component({
    tag: 'kompendium-example-example-value',
    shadow: true,
})
export class ExampleValueExample {
    public render(): HTMLElement {
        return <kompendium-example-value value={code} />;
    }
}
