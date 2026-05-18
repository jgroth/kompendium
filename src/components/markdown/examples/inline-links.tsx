import { Component, h } from '@stencil/core';
import { inlineLinksExample } from './inline-links-example';

/**
 * Inline `@link` references
 *
 * Demonstrates how inline `{@link Target}` references in markdown are
 * turned into clickable links.
 * @sourceFile inline-links-example.ts
 */
@Component({
    tag: 'kompendium-example-inline-links',
    shadow: true,
})
export class InlineLinksExample {
    public render(): HTMLElement {
        return <kompendium-markdown text={inlineLinksExample} />;
    }
}
