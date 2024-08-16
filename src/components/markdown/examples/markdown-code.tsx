import { Component, h } from '@stencil/core';

const markdown = `
~~~
const s = "JavaScript no syntax highlighting";
alert(s);
~~~

~~~javascript
const a = "JavaScript no syntax highlighting";
alert(a);
~~~
`;

/**
 * Code
 */
@Component({
    tag: 'kompendium-example-markdown-code',
    shadow: true,
})
export class MarkdownCodeExample {
    public render(): HTMLElement {
        return <kompendium-markdown text={markdown} />;
    }
}
