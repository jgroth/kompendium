import {
    anchorHref,
    currentRoute,
    entrySlug,
    exampleAnchorId,
    firstLine,
    slugify,
    uniqueExampleSlugs,
} from './anchors';

describe('anchors', () => {
    describe('slugify', () => {
        it('splits camelCase into dash-separated lowercase', () => {
            expect(slugify('myProperty')).toEqual('my-property');
        });

        it('replaces runs of non-alphanumerics with a single dash', () => {
            expect(slugify('--lime-color__primary')).toEqual(
                'lime-color-primary',
            );
        });

        it('trims leading and trailing dashes', () => {
            expect(slugify('  Hello, World!  ')).toEqual('hello-world');
        });

        it('lowercases acronyms', () => {
            expect(slugify('HTML')).toEqual('html');
        });
    });

    describe('firstLine', () => {
        it('returns the first non-empty trimmed line', () => {
            expect(firstLine('\n\n  Title here  \nbody')).toEqual('Title here');
        });

        it('returns an empty string for blank input', () => {
            expect(firstLine('   \n  \n')).toEqual('');
        });

        it('handles null/undefined input', () => {
            expect(firstLine(undefined as unknown as string)).toEqual('');
        });
    });

    describe('exampleAnchorId', () => {
        it('derives the id from the first line of the docs', () => {
            expect(exampleAnchorId('Basic example\nmore', 'my-tag')).toEqual(
                'basic-example',
            );
        });

        it('falls back to the tag when the docs have no title', () => {
            expect(exampleAnchorId('  \n ', 'my-example-tag')).toEqual(
                'my-example-tag',
            );
        });
    });

    describe('entrySlug', () => {
        it('combines the section slug with a slugified name', () => {
            expect(entrySlug('properties', 'myValue')).toEqual(
                'properties-my-value',
            );
        });
    });

    describe('uniqueExampleSlugs', () => {
        it('keeps distinct slugs unchanged', () => {
            const result = uniqueExampleSlugs([
                { docs: 'First', tag: 'a' },
                { docs: 'Second', tag: 'b' },
            ]);
            expect(result).toEqual(['first', 'second']);
        });

        it('appends numeric suffixes when slugs collide', () => {
            const result = uniqueExampleSlugs([
                { docs: 'Same title', tag: 'a' },
                { docs: 'Same title', tag: 'b' },
                { docs: 'Same title', tag: 'c' },
            ]);
            expect(result).toEqual([
                'same-title',
                'same-title-2',
                'same-title-3',
            ]);
        });

        it('uses the tag fallback before deduplicating', () => {
            const result = uniqueExampleSlugs([
                { docs: '', tag: 'my-example' },
                { docs: '', tag: 'my-example' },
            ]);
            expect(result).toEqual(['my-example', 'my-example-2']);
        });
    });

    describe('currentRoute / anchorHref', () => {
        const setHash = (hash: string) => {
            window.location.hash = hash;
        };

        afterEach(() => {
            setHash('');
        });

        it('returns the whole route when there is no secondary anchor', () => {
            setHash('#/component/my-component/');
            expect(currentRoute()).toEqual('/component/my-component/');
        });

        it('strips the trailing #fragment from the route', () => {
            setHash('#/component/my-component#basic-example');
            expect(currentRoute()).toEqual('/component/my-component');
        });

        it('returns an empty route when the hash is empty', () => {
            setHash('');
            expect(currentRoute()).toEqual('');
        });

        it('builds an href preserving the route and adding the slug', () => {
            setHash('#/component/my-component#old-anchor');
            expect(anchorHref('new-anchor')).toEqual(
                '#/component/my-component#new-anchor',
            );
        });
    });
});
