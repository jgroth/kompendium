import { Component, h, Prop, Element } from '@stencil/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-typescript.js';

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
     * @ignore
     */
    @Prop()
    public random: number;

    /**
     * Source code
     */
    @Prop()
    public code: string;

    @Element()
    private host: HTMLKompendiumCodeElement;

    protected componentDidLoad(): void {
        this.renderCode();
    }

    protected componentDidUpdate(): void {
        this.renderCode();
    }

    render(): HTMLElement {
        const classList = {};
        classList[`language-${this.language}`] = true;

        return (
            <pre class={classList}>
                <slot />
                <code class="root" />
            </pre>
        );
    }

    private renderCode() {
        const container = this.host.shadowRoot.querySelector('.root');
        container.innerHTML = Prism.highlight(
            this.findCode(),
            Prism.languages[this.language]
        );
    }

    private findCode() {
        const slot: HTMLSlotElement = this.host.shadowRoot.querySelector(
            'slot'
        );

        return [...slot.assignedNodes()]
            .map((node) => node.textContent)
            .join('');
    }
}
