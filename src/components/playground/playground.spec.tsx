import { newSpecPage } from '@stencil/core/testing';
import { JsonDocsComponent } from '@stencil/core/internal';
import { h } from '@stencil/core';
import { Playground } from './playground';
import { splitDocs } from './split-docs';

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

        const heading =
            page.root.shadowRoot.querySelector('h3.example-heading');
        expect(heading).not.toBeNull();
        expect(heading.textContent).toEqual('Basic example');
    });

    it('renders the rest of the docs as markdown', async () => {
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
        expect(text).toEqual('A longer description.');
    });
});

describe('splitDocs', () => {
    it('returns empty title and body for empty docs', () => {
        expect(splitDocs('')).toEqual({ title: '', body: '' });
    });

    it('returns empty title and body for blank-only docs', () => {
        expect(splitDocs('\n   \n\t\n')).toEqual({ title: '', body: '' });
    });

    it('returns empty title and body for null/undefined docs', () => {
        expect(splitDocs(undefined as unknown as string)).toEqual({
            title: '',
            body: '',
        });
    });

    it('returns a trimmed title and empty body for a title-only doc', () => {
        expect(splitDocs('  Just a title  ')).toEqual({
            title: 'Just a title',
            body: '',
        });
    });

    it('skips leading blank lines when locating the title', () => {
        expect(splitDocs('\n\n  Title  \nbody line')).toEqual({
            title: 'Title',
            body: 'body line',
        });
    });

    it('splits the title from a multi-line body', () => {
        expect(splitDocs('Title\n\nFirst paragraph.\nSecond.')).toEqual({
            title: 'Title',
            body: 'First paragraph.\nSecond.',
        });
    });
});
