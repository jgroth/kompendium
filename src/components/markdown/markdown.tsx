import { Component, h, Prop, Element } from '@stencil/core';
import unified from 'unified';
import markdown from 'remark-parse';
import html from 'rehype-stringify';
import remark2rehype from 'remark-rehype';
import map from 'unist-util-map';
import admonitions from 'remark-admonitions';

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
        unified()
            .use(markdown)
            .use(admonitions)
            .use(remark2rehype)
            .use(kompendiumCode)
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

function kompendiumCode() {
    return transformer;
}

function transformer(tree) {
    return map(tree, mapCodeNode);
}

function mapCodeNode(node) {
    if (node.type !== 'element') {
        return node;
    }

    if (node.tagName !== 'code') {
        return node;
    }

    const language = getLanguage(node.properties);
    if (!language) {
        return node;
    }

    return Object.assign({}, node, {
        type: 'element',
        tagName: 'kompendium-code',
        properties: {
            language: language,
        },
        children: [],
    });
}

function getLanguage(props: { className?: string[] }) {
    if (!props) {
        return;
    }

    if (!('className' in props)) {
        return;
    }

    const languageClass = props.className.find((name) =>
        name.startsWith('language-')
    );
    if (!languageClass) {
        return;
    }

    return languageClass.replace('language-', '');
}
