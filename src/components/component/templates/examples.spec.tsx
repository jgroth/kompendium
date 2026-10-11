import { newSpecPage } from '@stencil/core/testing';
import { JsonDocsComponent } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { ExampleList } from './examples';
import { Playground } from '../../playground/playground';

const example: JsonDocsComponent = {
    tag: 'my-component-example',
    docs: 'Basic example',
    docsTags: [],
} as any;

describe('ExampleList', () => {
    it('renders the section heading as an h2', async () => {
        const page = await newSpecPage({
            components: [Playground],
            template: () => (
                <div>
                    <ExampleList
                        examples={[example]}
                        slugs={['examples']}
                        id="component/my-component/examples/"
                        slugId="examples"
                        schema={undefined}
                    />
                </div>
            ),
        });

        const heading = page.body.querySelector(
            'h2.docs-layout-section-heading',
        );
        expect(heading).not.toBeNull();
        expect(heading.textContent).toEqual('Examples');
        expect(heading.id).toEqual('component/my-component/examples/');
    });

    it('does not render any heading below h2 for the section', async () => {
        const page = await newSpecPage({
            components: [Playground],
            template: () => (
                <div>
                    <ExampleList
                        examples={[example]}
                        slugs={['examples']}
                        id="component/my-component/examples/"
                        slugId="examples"
                        schema={undefined}
                    />
                </div>
            ),
        });

        expect(
            page.body.querySelector(
                'h3.docs-layout-section-heading, h4.docs-layout-section-heading, h5.docs-layout-section-heading',
            ),
        ).toBeNull();
    });
});
