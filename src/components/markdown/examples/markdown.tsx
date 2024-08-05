import { Component, h } from '@stencil/core';
import { markdownExample } from './markdown-example';

/**
 * This is a simple example of how the `kompendium-markdown` component is used
 * @link markdown-example.ts
 */
@Component({
    tag: 'kompendium-example-markdown',
    shadow: true,
})
export class MarkdownExample {
    public render(): HTMLElement {
        return <kompendium-markdown text={markdownExample} />;
    }
}
