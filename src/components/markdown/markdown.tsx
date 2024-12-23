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

    protected componentDidLoad(): void {
        this.renderMarkdown();
    }

    protected componentDidUpdate(): void {
        this.renderMarkdown();
    }

    private async renderMarkdown() {
        const types = getTypes();
        console.log('renderMarkdown -> this.text', this.text);
        const file = await markdownToHtml(this.text, types);
        console.log('renderMarkdown -> file', file);
        this.host.shadowRoot.querySelector('#root').innerHTML =
            file?.toString();
    }

    render(): HTMLElement {
        return <div id="root" />;
    }
}
