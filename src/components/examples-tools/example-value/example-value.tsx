import { Component, h, Prop } from '@stencil/core';
import { isDate, isObject, isArray, isUndefined } from 'lodash-es';

/**
 * This component is only used in our documentations
 * to render caught events from the components in
 * the examples.
 *
 * @exampleComponent kompendium-example-example-value
 */
@Component({
    tag: 'kompendium-example-value',
    styleUrl: 'example-value.scss',
})
export class ExampleValue {
    /**
     * A label describing the value. Defaults to `Value`.
     */
    @Prop({ reflect: true })
    public label: string = 'Value';

    /**
     * The value that should be displayed.
     */
    @Prop()
    public value: any;

    public render() {
        return (
            <span>
                {this.label}: {this.format(this.value)}
            </span>
        );
    }

    private format(val: any) {
        if (isUndefined(val)) {
            return <code>undefined</code>;
        }

        if (isDate(val)) {
            return <code>{val.toString()}</code>;
        }

        if (isObject(val) || isArray(val)) {
            return (
                <pre>
                    <code>{JSON.stringify(val, null, 2)}</code>
                </pre>
            );
        }

        return <code>{JSON.stringify(val, null, 2)}</code>;
    }
}
