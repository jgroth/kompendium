import { Component, h, Prop, Element } from '@stencil/core';
import { markdownToHtml } from '../../kompendium/markdown';
import { getTypes } from './markdown-types';

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
        this.scrollToAnchor();
    }

    private async renderMarkdown() {
        const types = getTypes();
        const file = await markdownToHtml(this.text, types);
        this.host.shadowRoot.querySelector('#root').innerHTML =
            file?.toString();

        // After content renders, scroll to anchor if present in URL
        this.scrollToAnchor();
    }

    private scrollToAnchor(): void {
        const hash = window.location.hash;
        if (!hash) {
            return;
        }

        // Extract anchor ID from hash (remove leading #)
        // Handle both simple anchors (#section) and route-based anchors (#/guide/page#section)
        const anchorMatch = hash.match(/#([^#]+)$/);
        if (!anchorMatch) {
            return;
        }

        const anchorId = anchorMatch[1];

        // Wait for next frame to ensure DOM is ready, then scroll
        requestAnimationFrame(() => {
            this.scrollToElement(anchorId, 'auto');
        });
    }

    private scrollToElement(id: string, behavior: ScrollBehavior): void {
        const element = this.host.shadowRoot.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior });
        }
    }

    render(): HTMLElement {
        return <div id="root" />;
    }
}
