import { Component, h } from '@stencil/core';

const markdown = `
:::note
Some important note.
:::

:::tip
A very useful tip!
:::

:::warning
Just be careful.
:::

:::danger
This is too risky.
:::

:::important
This is vey important!
:::

:::info
Just for your information…
:::
`;

/**
 * Callout
 */
@Component({
    tag: 'kompendium-example-markdown-callout',
    shadow: true,
})
export class MarkdownCalloutExample {
    public render(): HTMLElement {
        return <kompendium-markdown text={markdown} />;
    }
}
