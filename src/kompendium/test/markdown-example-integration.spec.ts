import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { markdownToHtml } from '../markdown';
import { inlineLinksExample } from '../../components/markdown/examples/inline-links-example';

const KOMPENDIUM_JSON = join(
    __dirname,
    '..',
    '..',
    '..',
    'www',
    'kompendium.json',
);

const isBuilt = existsSync(KOMPENDIUM_JSON);
const describeIfBuilt = isBuilt ? describe : describe.skip;

// Make the skip visible in CI output: a bare `describe.skip` is invisible, so
// a missing `www/kompendium.json` would silently drop this real-registry
// coverage with no signal. This always-run guard surfaces why it was skipped.
if (!isBuilt) {
    describe('inline @link integration coverage', () => {
        it('is skipped because www/kompendium.json is not built (run the build first to enable)', () => {
            console.warn(
                'Skipping inline-links integration test: www/kompendium.json not found. ' +
                    'Build the docs (so the real type/component registry exists) to run it.',
            );
            expect(isBuilt).toBe(false);
        });
    });
}

describeIfBuilt('inline @link in the inline-links example', () => {
    it('renders every reference correctly under the real Kompendium type registry', async () => {
        const data = JSON.parse(readFileSync(KOMPENDIUM_JSON, 'utf8'));
        const types: string[] = data.types.map((t: any) => t.name);
        const components: string[] = data.docs.components.map(
            (c: any) => c.tag,
        );

        const result = await markdownToHtml(
            inlineLinksExample,
            types,
            components,
        );
        const html = result.toString();

        // Bare reference to a known component → linked with code wrapping
        expect(html).toContain(
            '<a href="#/component/kompendium-markdown/"><code>kompendium-markdown</code></a>',
        );

        // Bare reference to a known type → linked with code wrapping
        expect(html).toContain(
            '<a href="#/type/MenuItem"><code>MenuItem</code></a>',
        );

        // Free-form label (pipe + space variants) → linked but plain prose label
        expect(html).toContain(
            '<a href="#/type/MenuItem">the menu item interface</a>',
        );

        // Absolute URL → linked, plain label
        expect(html).toContain(
            '<a href="https://example.com">external resource</a>',
        );

        // Unknown identifier → inline code, no link
        expect(html).toContain('<code>DoesNotExist</code>');
        expect(html).not.toContain('href="#/type/DoesNotExist"');

        // Raw `{@link …}` syntax must never leak into the rendered prose.
        // It is deliberately preserved inside fenced and inline code (the
        // example demonstrates both), so strip those before asserting.
        const proseOnly = html
            .replace(/<pre>[\s\S]*?<\/pre>/g, '')
            .replace(/<code>[\s\S]*?<\/code>/g, '');
        expect(proseOnly).not.toContain('{@link');
    });
});
