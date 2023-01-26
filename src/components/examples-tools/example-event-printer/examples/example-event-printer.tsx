import { Component, h } from '@stencil/core';

@Component({
    tag: 'kompendium-example-example-event-printer',
    shadow: true,
})
export class ExampleEventPrinterExample {
    private eventPrinter: HTMLKompendiumExampleEventPrinterElement;

    public render() {
        return [
            <p>
                <button type="button" onClick={this.handleClick}>
                    Click me
                </button>
            </p>,
            <kompendium-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

    private handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.eventPrinter.writeEvent(event);
    };
}
