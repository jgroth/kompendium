import { Component, Host, h, Prop, Element } from '@stencil/core';
import remark from 'remark';
import html from 'remark-html';
import recommended from 'remark-preset-lint-recommended';

/**
 * This component renders markdown!
 */
@Component({
    tag: 'maki-markdown',
    shadow: true
})
export class Markdown {
    @Prop()
    public text: string;

    @Element()
    private host: HTMLElement;

    protected componentDidLoad() {
        this.renderMarkdown();
    }

    protected componentDidUpdate() {
        this.renderMarkdown();
    }

    private renderMarkdown() {
        console.log('rendering markdown')
        remark().use(recommended).use(html).process(this.text, (err, file) => {
            this.host.shadowRoot.querySelector('#root').innerHTML = String(file);
        });
    }

    render() {
        return (
            <div id="root"/>
        );
    }

}
