import { Component, h, Prop, Element } from '@stencil/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-typescript.js';

@Component({
    tag: 'kompendium-code',
    styleUrl: 'code.scss',
    shadow: true
})
export class Code {

    @Prop()
    public language: string;

    @Prop()
    public code: string;

    @Element()
    private host: HTMLElement;

    protected componentDidLoad() {
        this.renderCode();
    }

    protected componentDidUpdate() {
        this.renderCode();
    }

    render() {
        const classList = {};
        classList[`language-${this.language}`] = true;

        return (
            <pre class={classList}>
                <code class="root" />
            </pre>
        );
    }

    private renderCode() {
        const container = this.host.shadowRoot.querySelector('.root');
        container.innerHTML = Prism.highlight(this.code, Prism.languages[this.language]);
    }
}
