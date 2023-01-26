import { Component, h } from '@stencil/core';
/**
 * Basic example
 * Which provides a gird that can contain the controls.
 * Note how the default width of grid children can affect the
 * layout.
 */
@Component({
    tag: 'kompendium-example-example-controls',
    shadow: true,
})
export class ExampleControlsExample {
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
