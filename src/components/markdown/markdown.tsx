import { Component, h, Prop, Element } from '@stencil/core';
import remark from 'remark';
import html from 'remark-html';
import recommended from 'remark-preset-lint-recommended';

/**
 * This component renders markdown
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

    private renderMarkdown() {
        remark()
            .use(recommended)
            .use(html)
            .process(this.text, (_, file) => {
                this.host.shadowRoot.querySelector('#root').innerHTML = String(
                    file
                );
            });
    }

    render(): HTMLElement {
        return <div id="root" />;
    }
}
