import { Component, h, Prop, Element } from '@stencil/core';
import { markdownToHtml } from '../../kompendium/markdown';

/**
 * This component renders markdown
 *
 * @exampleComponent kompendium-example-markdown
 * This is a simple example of how the `kompendium-markdown` component is used
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
        const file = await markdownToHtml(this.text);
        this.host.shadowRoot.querySelector('#root').innerHTML = file.toString();
    }

    render(): HTMLElement {
        return <div id="root" />;
    }
}
