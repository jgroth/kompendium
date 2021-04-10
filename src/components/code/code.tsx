import { Component, h, Prop, Element, State } from '@stencil/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/plugins/toolbar/prism-toolbar.js';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js';

/**
 * @exampleComponent kompendium-example-code
 */
@Component({
    tag: 'kompendium-code',
    styleUrl: 'code.scss',
    shadow: true,
})
export class Code {
    /**
     * The language of the code
     */
    @Prop()
    public language: string;

    /**
     * Source code
     */
    @State()
    public code: string;

    @Element()
    private host: HTMLKompendiumCodeElement;

    public componentDidLoad(): void {
        setTimeout(() => {
            this.code = this.findCode();
        });
    }

    public componentWillRender(): void {
        this.code = this.findCode();
    }

    public componentDidRender(): void {
        const container = this.host.shadowRoot.querySelector('.root pre code');
        Prism.highlightElement(container);
    }

    render(): HTMLElement {
        const classList = {};
        classList[`language-${this.language}`] = true;

        return (
            <div class="root">
                <slot />
                <pre class={classList}>
                    <code>{this.code}</code>
                </pre>
            </div>
        );
    }

    private findCode() {
        const slot: HTMLSlotElement = this.host.shadowRoot.querySelector(
            'slot'
        );

        if (!slot) {
            return;
        }

        return [...slot.assignedNodes()]
            .map((node) => node.textContent)
            .join('');
    }
}
