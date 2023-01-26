import { Component, h } from '@stencil/core';

/**
 * This component is only used in our documentations
 * to provide a container for settings of examples.
 *
 * For example, it visually groups and organizes checkboxes
 * used to show different states of components,
 * such as Disabled, Required, Readonly, etc…
 *
 * @exampleComponent kompendium-example-example-controls
 * @exampleComponent kompendium-example-example-controls-styles
 */
@Component({
    tag: 'kompendium-example-controls',
    shadow: true,
    styleUrl: 'example-controls.scss',
})
export class ExampleControls {
    public render() {
        return <slot />;
    }
}
