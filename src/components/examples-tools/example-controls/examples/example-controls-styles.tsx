import { Component, h } from '@stencil/core';
/**
 * How to change layout
 * You can use the provided CSS variables to affect the layout.
 * - `--example-controls-max-columns-width` Allows to set a maximum width for columns in the default layout.
 * - `--example-controls-column-layout` If set to `auto-fit`, it stretches the columns within the container.
 */
@Component({
    tag: 'kompendium-example-example-controls-styles',
    shadow: true,
    styleUrl: 'example-controls-styles.scss',
})
export class ExampleControlsStylesExample {
    public render() {
        return (
            <kompendium-example-controls>
                <span>
                    <input
                        type="checkbox"
                        id="one"
                        name="First setting"
                        checked
                    ></input>
                    <label htmlFor="one">First setting</label>
                </span>
                <span>
                    <input
                        type="checkbox"
                        id="two"
                        name="Second setting"
                        checked
                    ></input>
                    <label htmlFor="two">Second setting</label>
                </span>
                <button type="button">Button</button>
            </kompendium-example-controls>
        );
    }
}
