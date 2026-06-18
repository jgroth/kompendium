import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { Toc } from './toc';
import { collectIds, findAncestorsOf, findEntryById } from './toc.tree';
import { TocEntry } from './toc.types';

const tree: TocEntry[] = [
    {
        id: 'examples',
        title: 'Examples',
        collapsible: true,
        children: [
            { id: 'basic-example', title: 'Basic example' },
            { id: 'advanced-example', title: 'Advanced example' },
        ],
    },
    {
        id: 'properties',
        title: 'Properties',
        collapsible: true,
        children: [{ id: 'properties-value', title: 'value' }],
    },
];

describe('toc helpers', () => {
    describe('collectIds', () => {
        it('collects every id in the tree, including nested ones', () => {
            expect([...collectIds(tree)].sort()).toEqual(
                [
                    'advanced-example',
                    'basic-example',
                    'examples',
                    'properties',
                    'properties-value',
                ].sort(),
            );
        });

        it('returns an empty set for an empty list', () => {
            expect(collectIds([]).size).toEqual(0);
        });
    });

    describe('findEntryById', () => {
        it('finds a top-level entry', () => {
            expect(findEntryById('properties', tree)?.title).toEqual(
                'Properties',
            );
        });

        it('finds a nested entry', () => {
            expect(findEntryById('advanced-example', tree)?.title).toEqual(
                'Advanced example',
            );
        });

        it('returns null when no entry matches', () => {
            expect(findEntryById('missing', tree)).toBeNull();
        });
    });

    describe('findAncestorsOf', () => {
        it('returns the ancestor chain of a nested entry', () => {
            const ancestors = findAncestorsOf('basic-example', tree).map(
                (entry) => entry.id,
            );
            expect(ancestors).toEqual(['examples']);
        });

        it('returns an empty chain for a top-level entry', () => {
            expect(findAncestorsOf('examples', tree)).toEqual([]);
        });

        it('returns an empty chain for an unknown id', () => {
            expect(findAncestorsOf('missing', tree)).toEqual([]);
        });
    });
});

describe('kompendium-toc', () => {
    afterEach(() => {
        window.location.hash = '';
    });

    it('renders nothing actionable when there are no entries', async () => {
        const page = await newSpecPage({
            components: [Toc],
            template: () => <kompendium-toc entries={[]} />,
        });

        expect(
            page.root.shadowRoot.querySelector('.toc.hidden'),
        ).not.toBeNull();
        expect(page.root.shadowRoot.querySelector('.fab')).toBeNull();
    });

    it('expands the section containing the active anchor', async () => {
        const page = await newSpecPage({
            components: [Toc],
            template: () => <kompendium-toc entries={tree} />,
        });

        // The `properties` section is collapsed by default.
        const propertiesToggle = () =>
            Array.from(page.root.shadowRoot.querySelectorAll('.toggle')).find(
                (toggle) =>
                    toggle.getAttribute('aria-label')?.includes('Properties'),
            );
        expect(propertiesToggle()?.getAttribute('aria-expanded')).toEqual(
            'false',
        );

        // Navigating to an anchor nested under it should auto-expand it.
        window.location.hash = '#/component/my-component#properties-value';
        window.dispatchEvent(new Event('hashchange'));
        await page.waitForChanges();

        expect(propertiesToggle()?.getAttribute('aria-expanded')).toEqual(
            'true',
        );
    });

    it('prunes user toggles for entries that no longer exist', async () => {
        const page = await newSpecPage({
            components: [Toc],
            template: () => <kompendium-toc entries={tree} />,
        });
        const toc = page.rootInstance as Toc;

        // Simulate a user override on the properties section.
        (toc as any).userToggles = new Map([['properties', true]]);

        // Replace the entries with a tree that no longer has `properties`.
        (toc as any).onEntriesChange([tree[0]]);

        expect((toc as any).userToggles.has('properties')).toBe(false);
    });
});
