import { Component, h, Prop, Element } from '@stencil/core';
import { markdownToHtml } from '../../kompendium/markdown';
import { getTypes } from './markdown-types';

/**
 * This component renders markdown
 * @exampleComponent kompendium-example-markdown-headings
 * @exampleComponent kompendium-example-markdown-emphasis
 * @exampleComponent kompendium-example-markdown-lists
 * @exampleComponent kompendium-example-markdown-links
 * @exampleComponent kompendium-example-markdown-images
 * @exampleComponent kompendium-example-markdown-code
 * @exampleComponent kompendium-example-markdown-tables
 * @exampleComponent kompendium-example-markdown-blockquotes
 * @exampleComponent kompendium-example-markdown-horizontal-rule
 * @exampleComponent kompendium-example-markdown-callout
 * @exampleComponent kompendium-example-markdown-other
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

    protected componentDidLoad(): void {
        this.renderMarkdown();
    }

    protected componentDidUpdate(): void {
        this.renderMarkdown();
    }

    private async renderMarkdown() {
        const types = getTypes();
        const file = await markdownToHtml(this.text, types);
        this.host.shadowRoot.querySelector('#root').innerHTML =
            file?.toString();
    }

    render(): HTMLElement {
        return <div id="root" />;
    }
}
