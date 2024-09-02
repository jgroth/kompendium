import { Component, h } from '@stencil/core';

const markdown = `
Three or more of…

---

Hyphens,

***

Asterisks,

___

Or Underscores
`;

/**
 * Horizontal Rule
 */
@Component({
    tag: 'kompendium-example-markdown-horizontal-rule',
    shadow: true,
})
export class MarkdownHorizontalRuleExample {
    public render(): HTMLElement {
        return <kompendium-markdown text={markdown} />;
    }
}
