import { markdownToHtml } from '../markdown';

describe('markdownToHtml()', () => {
    describe('when markdown contains frontmatter', () => {
        it('saves the frontmatter in the file data', async () => {
            const markdown = '---\nkey: value\n---\n# Test';
            const result = await markdownToHtml(markdown);
            expect(result.data.frontmatter).toEqual({ key: 'value' });
        });

        it('does not return the frontmatter in the html', async () => {
            const markdown = '---\nkey: value\n---\n# Test';
            const html = '<h1>Test</h1>';
            const result = await markdownToHtml(markdown);
            expect(result.toString()).toEqual(html);
        });
    });

    describe('when markdown contains admonitions', () => {
        it('returns the correct markup for the sections', async () => {
            const markdown = ':::note test\nHello, World!\n:::';
            const html = `
                <div class="admonition admonition-note alert alert--secondary">
                    <div class="admonition-heading">
                        <h5>test</h5>
                    </div>
                    <div class="admonition-content">
                        <p>Hello, World!</p>
                    </div>
                </div>`;
            const result = await markdownToHtml(markdown);
            expect(result.toString()).toEqualHtml(html);
        });
    });

    describe('when there is a codeblock with a language', () => {
        it('formats the code using the code component', async () => {
            const markdown = '```ts\ncode\n```';
            const html = `
                <pre><kompendium-code language="ts">code
</kompendium-code></pre>`;
            const result = await markdownToHtml(markdown);
            expect(result.toString()).toEqualHtml(html);
        });
    });

    describe('when there is a codeblock with no language', () => {
        it('uses normal code formatting for the block', async () => {
            const markdown = '```\ncode\n```';
            const html = `
                <pre><code>code
</code></pre>`;
            const result = await markdownToHtml(markdown);
            expect(result.toString()).toEqualHtml(html);
        });
    });
});
