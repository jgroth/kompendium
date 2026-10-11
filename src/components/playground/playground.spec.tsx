import { newSpecPage } from '@stencil/core/testing';
import { JsonDocsComponent } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { Playground } from './playground';

const example: JsonDocsComponent = {
    tag: 'my-component-example',
    docs: 'Basic example\n\nA longer description.',
    docsTags: [],
} as any;

describe('kompendium-playground', () => {
    it('renders the example title as an h3 heading', async () => {
        const page = await newSpecPage({
            components: [Playground],
            template: () => (
                <kompendium-playground component={example} schema={undefined} />
            ),
        });

        const markdown = page.root.shadowRoot.querySelector(
            'kompendium-markdown',
        );
        const text = (markdown as any).text ?? markdown.getAttribute('text');
        expect(text).toEqual('### Basic example\n\nA longer description.');
    });
});
