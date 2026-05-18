import { Component, h, Prop, Element } from '@stencil/core';
import { markdownToHtml } from '../../kompendium/markdown';
import { getComponents, getTypes } from './markdown-types';
import { scrollToAnchor } from '../anchor-scroll';

/**
 * This component renders markdown
 * @exampleComponent kompendium-example-markdown
 */
@Component({
    tag: 'kompendium-markdown',
    shadow: true,
    styleUrl: 'markdown.scss',
})
export class Markdown {
    private renderSeq = 0;

    /**
     * The text to render
     */
    @Prop()
    public text: string;

    @Element()
    private host: HTMLKompendiumMarkdownElement;

    constructor() {
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    protected connectedCallback(): void {
        window.addEventListener('hashchange', this.handleHashChange);
    }

    protected disconnectedCallback(): void {
        window.removeEventListener('hashchange', this.handleHashChange);
    }

    protected componentDidLoad(): void {
        this.renderMarkdown();
    }

    protected componentDidUpdate(): void {
        this.renderMarkdown();
    }

    private handleHashChange(): void {
        scrollToAnchor(this.host.shadowRoot);
    }

    private async renderMarkdown() {
        const renderSeq = ++this.renderSeq;
        const currentText = this.text;
        const types = getTypes();
        const components = getComponents();
        const file = await markdownToHtml(currentText, types, components);

        // Abort if a newer render has started or text has changed
        if (renderSeq !== this.renderSeq || currentText !== this.text) {
            return;
        }

        this.host.shadowRoot.querySelector('#root').innerHTML =
            file?.toString();

        // After content renders, scroll to anchor if present in URL
        scrollToAnchor(this.host.shadowRoot);
    }

    render(): HTMLElement {
        return <div id="root" />;
    }
}
