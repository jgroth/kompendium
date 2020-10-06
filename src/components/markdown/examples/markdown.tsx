import { Component, h } from '@stencil/core';
import { bacon } from './bacon';

/**
 * This is a simple example of how the `kompendium-markdown` component is used
 *
 * @link bacon.ts
 */
@Component({
    tag: 'kompendium-example-markdown',
    shadow: true,
    styleUrl: 'markdown.scss',
})
export class MarkdownExample {
    public render(): HTMLElement {
        return <kompendium-markdown text={bacon} />;
    }
}
