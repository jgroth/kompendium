import { Component, h } from '@stencil/core';

const markdown = `
Here's our logo (hover to see the title text):

Inline-style:
![alt text](https://docs.kompendium.dev/~gitbook/image?url=https%3A%2F%2Fuser-images.githubusercontent.com%2F35954987%2F99229931-f5889200-27ee-11eb-934e-6284b6978b07.png&width=300&dpr=2&quality=100&sign=5a11d8e&sv=1 "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: https://docs.kompendium.dev/~gitbook/image?url=https%3A%2F%2Fuser-images.githubusercontent.com%2F35954987%2F99229931-f5889200-27ee-11eb-934e-6284b6978b07.png&width=300&dpr=2&quality=100&sign=5a11d8e&sv=1 "Logo Title Text 2"
`;

/**
 * Images
 */
@Component({
    tag: 'kompendium-example-markdown-images',
    shadow: true,
})
export class MarkdownImageExample {
    public render(): HTMLElement {
        return <kompendium-markdown text={markdown} />;
    }
}
