import { newSpecPage } from '@stencil/core/testing';
import { JsonDocs } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { KompendiumDebug } from './debug';

const docs: JsonDocs = {
    components: [
        {
            tag: 'my-button',
            docs: 'A button.',
            docsTags: [
                {
                    name: 'exampleComponent',
                    text: 'my-button-example',
                },
            ],
        },
        {
            tag: 'my-button-example',
            docs: 'Basic button\n\nA longer description.',
            docsTags: [],
        },
    ],
} as any;

async function createPage() {
    return newSpecPage({
        components: [KompendiumDebug],
        template: () => (
            <kompendium-debug
                docs={docs}
                schemas={[{ $id: 'my-button' }]}
                match={{ params: { name: 'my-button-example' } } as any}
            />
        ),
    });
}

describe('kompendium-debug', () => {
    it('renders the component name as an h2 heading', async () => {
        const page = await createPage();

        const heading = page.root.shadowRoot.querySelector('h2');
        expect(heading).not.toBeNull();
        expect(heading.textContent).toEqual('Button');
    });

    it('renders the example title as an h3 heading', async () => {
        const page = await createPage();

        const heading = page.root.shadowRoot.querySelector('h3');
        expect(heading).not.toBeNull();
        expect(heading.textContent).toEqual('Basic button');
    });
});
