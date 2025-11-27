import { Component, h } from '@stencil/core';

const markdown = `
## abbr, sub, sup, kbd, mark

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.

## Emoji Rendering

<p><span class="nowrap"><span class="emojify">🙈</span> <code>:see_no_evil:</code></span>  <span class="nowrap"><span class="emojify">🙉</span> <code>:hear_no_evil:</code></span>  <span class="nowrap"><span class="emojify">🙊</span> <code>:speak_no_evil:</code></span></p>
<br></br>
`;

/**
 * Other Elements
 */
@Component({
    tag: 'kompendium-example-markdown-other',
    shadow: true,
})
export class MarkdownOtherExample {
    public render(): HTMLElement {
        return <kompendium-markdown text={markdown} />;
    }
}
