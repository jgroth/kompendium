import { Component, h, Prop, Element } from '@stencil/core';
import { markdownToHtml } from '../../kompendium/markdown';
import { getTypes } from './markdown-types';
import { getRoute, scrollToAnchor } from '../anchor-scroll';

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
        const file = await markdownToHtml(currentText, types);

        // Abort if a newer render has started or text has changed
        if (renderSeq !== this.renderSeq || currentText !== this.text) {
            return;
        }

        this.host.shadowRoot.querySelector('#root').innerHTML =
            file?.toString();

        // Add anchor links to headings
        this.addAnchorLinks();

        // After content renders, scroll to anchor if present in URL
        scrollToAnchor(this.host.shadowRoot);
    }

    private addAnchorLinks(): void {
        const root = this.host.shadowRoot.querySelector('#root');
        const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');

        headings.forEach((heading: HTMLElement) => {
            if (!heading.id) {
                return;
            }

            // Skip if anchor link already exists
            if (heading.querySelector('.anchor-link')) {
                return;
            }

            const anchor = document.createElement('a');
            anchor.className = 'anchor-link';
            anchor.href = this.getAnchorHref(heading.id);
            anchor.setAttribute('aria-label', `Link to ${heading.textContent}`);
            anchor.innerHTML = '#';
            anchor.addEventListener('click', (event) => {
                this.handleAnchorClick(event, heading.id);
            });

            heading.appendChild(anchor);
        });
    }

    private getAnchorHref(id: string): string {
        const route = getRoute();
        const routeWithoutAnchor = route.split('#')[0];

        return `#${routeWithoutAnchor}#${id}`;
    }

    private handleAnchorClick(event: MouseEvent, id: string): void {
        event.preventDefault();

        const url = this.getAnchorHref(id);
        const fullUrl = `${window.location.origin}${window.location.pathname}${url}`;

        // Update the URL
        window.history.pushState(null, '', url);

        // Copy to clipboard
        navigator.clipboard.writeText(fullUrl).catch(() => {
            // Fallback: just navigate if clipboard fails
        });
    }

    render(): HTMLElement {
        return <div id="root" />;
    }
}
