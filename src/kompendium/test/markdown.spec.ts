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
            const html = '<h1 id="test">Test</h1>';
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
                        <h5 id="test">test</h5>
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

    describe('when markdown contains headings', () => {
        it('adds id attributes based on heading text', async () => {
            const markdown = '# Hello World\n\n## Getting Started';
            const result = await markdownToHtml(markdown);
            expect(result.toString()).toContain('id="hello-world"');
            expect(result.toString()).toContain('id="getting-started"');
        });

        it('handles special characters in headings', async () => {
            const markdown = "# What's New in v2.0?";
            const result = await markdownToHtml(markdown);
            expect(result.toString()).toContain('id="whats-new-in-v20"');
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
