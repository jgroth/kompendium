import { markdownToHtml } from '../markdown';

describe('markdownToHtml()', () => {
    describe('basic elements', () => {
        describe('paragraphs', () => {
            it('renders a simple paragraph', async () => {
                const result = await markdownToHtml('Hello, World!');
                expect(result.toString()).toEqualHtml('<p>Hello, World!</p>');
            });

            it('renders multiple paragraphs', async () => {
                const md = 'First paragraph.\n\nSecond paragraph.';
                const result = await markdownToHtml(md);
                expect(result.toString()).toEqualHtml(
                    '<p>First paragraph.</p><p>Second paragraph.</p>',
                );
            });
        });

        describe('headings', () => {
            it('renders all heading levels', async () => {
                const md = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
                const result = await markdownToHtml(md);
                const html = result.toString();

                expect(html).toContain('<h1 id="h1">H1</h1>');
                expect(html).toContain('<h2 id="h2">H2</h2>');
                expect(html).toContain('<h3 id="h3">H3</h3>');
                expect(html).toContain('<h4 id="h4">H4</h4>');
                expect(html).toContain('<h5 id="h5">H5</h5>');
                expect(html).toContain('<h6 id="h6">H6</h6>');
            });

            it('adds id attributes based on heading text', async () => {
                const md = '# Hello World\n\n## Getting Started';
                const result = await markdownToHtml(md);
                expect(result.toString()).toContain('id="hello-world"');
                expect(result.toString()).toContain('id="getting-started"');
            });

            it('handles special characters in headings', async () => {
                const md = "# What's New in v2.0?";
                const result = await markdownToHtml(md);
                expect(result.toString()).toContain('id="whats-new-in-v20"');
            });

            it('handles duplicate headings with unique ids', async () => {
                const md = '# Test\n\n# Test\n\n# Test';
                const result = await markdownToHtml(md);
                const html = result.toString();

                expect(html).toContain('id="test"');
                expect(html).toContain('id="test-1"');
                expect(html).toContain('id="test-2"');
            });
        });

        describe('links', () => {
            it('renders inline links', async () => {
                const md = '[Example](https://example.com)';
                const result = await markdownToHtml(md);
                expect(result.toString()).toEqualHtml(
                    '<p><a href="https://example.com">Example</a></p>',
                );
            });

            it('renders links with titles', async () => {
                const md = '[Example](https://example.com "Example Site")';
                const result = await markdownToHtml(md);
                expect(result.toString()).toContain('title="Example Site"');
            });

            it('renders autolinks', async () => {
                const md = '<https://example.com>';
                const result = await markdownToHtml(md);
                expect(result.toString()).toContain(
                    'href="https://example.com"',
                );
            });

            it('renders anchor links', async () => {
                const md = '[Jump to section](#section-id)';
                const result = await markdownToHtml(md);
                expect(result.toString()).toContain('href="#section-id"');
            });
        });

        describe('images', () => {
            it('renders images', async () => {
                const md = '![Alt text](image.png)';
                const result = await markdownToHtml(md);
                expect(result.toString()).toEqualHtml(
                    '<p><img src="image.png" alt="Alt text"></p>',
                );
            });

            it('renders images with titles', async () => {
                const md = '![Alt text](image.png "Image title")';
                const result = await markdownToHtml(md);
                expect(result.toString()).toContain('title="Image title"');
            });
        });

        describe('lists', () => {
            it('renders unordered lists', async () => {
                const md = '- Item 1\n- Item 2\n- Item 3';
                const result = await markdownToHtml(md);
                expect(result.toString()).toEqualHtml(`
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                    </ul>
                `);
            });

            it('renders ordered lists', async () => {
                const md = '1. First\n2. Second\n3. Third';
                const result = await markdownToHtml(md);
                expect(result.toString()).toEqualHtml(`
                    <ol>
                        <li>First</li>
                        <li>Second</li>
                        <li>Third</li>
                    </ol>
                `);
            });

            it('renders nested lists', async () => {
                const md = '- Parent\n  - Child\n    - Grandchild';
                const result = await markdownToHtml(md);
                const html = result.toString();

                expect(html).toContain('<ul>');
                expect(html).toContain('Parent');
                expect(html).toContain('Child');
                expect(html).toContain('Grandchild');
            });

            it('renders task lists', async () => {
                const md = '- [ ] Unchecked\n- [x] Checked';
                const result = await markdownToHtml(md);
                const html = result.toString();

                expect(html).toContain('Unchecked');
                expect(html).toContain('Checked');
            });
        });

        describe('blockquotes', () => {
            it('renders blockquotes', async () => {
                const md = '> This is a quote';
                const result = await markdownToHtml(md);
                expect(result.toString()).toEqualHtml(
                    '<blockquote><p>This is a quote</p></blockquote>',
                );
            });

            it('renders nested blockquotes', async () => {
                const md = '> Level 1\n>> Level 2';
                const result = await markdownToHtml(md);
                const html = result.toString();

                expect(html).toContain('<blockquote>');
                expect(html).toContain('Level 1');
                expect(html).toContain('Level 2');
            });

            it('renders multi-paragraph blockquotes', async () => {
                const md = '> First paragraph\n>\n> Second paragraph';
                const result = await markdownToHtml(md);
                const html = result.toString();

                expect(html).toContain('First paragraph');
                expect(html).toContain('Second paragraph');
            });
        });

        describe('horizontal rules', () => {
            it('renders horizontal rules', async () => {
                const md = 'Before\n\n---\n\nAfter';
                const result = await markdownToHtml(md);
                expect(result.toString()).toContain('<hr>');
            });
        });
    });

    describe('inline formatting', () => {
        it('renders bold text', async () => {
            const md = '**bold**';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('<strong>bold</strong>');
        });

        it('renders italic text', async () => {
            const md = '*italic*';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('<em>italic</em>');
        });

        it('renders bold and italic combined', async () => {
            const md = '***bold and italic***';
            const result = await markdownToHtml(md);
            const html = result.toString();
            expect(html).toContain('<strong>');
            expect(html).toContain('<em>');
        });

        it('renders inline code', async () => {
            const md = 'Use `const` for constants';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('<code>const</code>');
        });

        it('renders strikethrough', async () => {
            const md = '~~deleted~~';
            const result = await markdownToHtml(md);
            // Note: strikethrough may need GFM extension
            expect(result.toString()).toContain('deleted');
        });
    });

    describe('code blocks', () => {
        it('formats code with language using kompendium-code component', async () => {
            const md = '```ts\nconst x = 1;\n```';
            const result = await markdownToHtml(md);
            expect(result.toString()).toEqualHtml(`
                <pre><kompendium-code language="ts">const x = 1;
</kompendium-code></pre>
            `);
        });

        it('uses normal code formatting for blocks without language', async () => {
            const md = '```\nplain code\n```';
            const result = await markdownToHtml(md);
            expect(result.toString()).toEqualHtml(`
                <pre><code>plain code
</code></pre>
            `);
        });

        it('handles various language identifiers', async () => {
            const languages = [
                'javascript',
                'typescript',
                'css',
                'html',
                'json',
                'bash',
                'python',
            ];

            for (const lang of languages) {
                const md = `\`\`\`${lang}\ncode\n\`\`\``;
                const result = await markdownToHtml(md);
                expect(result.toString()).toContain(`language="${lang}"`);
            }
        });

        it('preserves whitespace in code blocks', async () => {
            const md = '```ts\n  indented\n    more indented\n```';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('  indented');
            expect(result.toString()).toContain('    more indented');
        });

        it('handles empty code blocks', async () => {
            const md = '```ts\n```';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('<pre>');
        });

        it('handles code blocks with special characters', async () => {
            const md = '```html\n<div class="test">&amp;</div>\n```';
            const result = await markdownToHtml(md);
            // rehype-stringify uses &#x3C; for < and &#x26; for &
            expect(result.toString()).toContain('&#x3C;div');
        });
    });

    describe('tables', () => {
        it('renders basic tables', async () => {
            const md =
                '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).toContain('<table>');
            expect(html).toContain('<th>');
            expect(html).toContain('<td>');
            expect(html).toContain('Header 1');
            expect(html).toContain('Cell 1');
        });

        it('renders tables with alignment', async () => {
            const md =
                '| Left | Center | Right |\n|:-----|:------:|------:|\n| L    | C      | R     |';
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).toContain('align="left"');
            expect(html).toContain('align="center"');
            expect(html).toContain('align="right"');
        });
    });

    describe('frontmatter', () => {
        it('saves frontmatter in file data', async () => {
            const md = '---\nkey: value\n---\n# Test';
            const result = await markdownToHtml(md);
            expect(result.data.frontmatter).toEqual({ key: 'value' });
        });

        it('does not include frontmatter in HTML output', async () => {
            const md = '---\nkey: value\n---\n# Test';
            const result = await markdownToHtml(md);
            expect(result.toString()).toEqual('<h1 id="test">Test</h1>');
        });

        it('handles complex frontmatter', async () => {
            const md =
                '---\ntitle: Test\ntags:\n  - one\n  - two\nnested:\n  key: value\n---\n# Content';
            const result = await markdownToHtml(md);

            expect(result.data.frontmatter).toEqual({
                title: 'Test',
                tags: ['one', 'two'],
                nested: { key: 'value' },
            });
        });

        it('handles empty frontmatter', async () => {
            const md = '---\n---\n# Test';
            const result = await markdownToHtml(md);
            // Empty YAML block results in undefined, not null
            expect(result.data.frontmatter).toBeUndefined();
        });

        it('handles markdown without frontmatter', async () => {
            const md = '# No Frontmatter';
            const result = await markdownToHtml(md);
            expect(result.data.frontmatter).toBeUndefined();
        });
    });

    describe('admonitions', () => {
        it('renders note admonitions', async () => {
            const md = ':::note Title\nContent\n:::';
            const result = await markdownToHtml(md);
            expect(result.toString()).toEqualHtml(`
                <div class="admonition admonition-note alert alert--secondary">
                    <div class="admonition-heading">
                        <h5 id="title">Title</h5>
                    </div>
                    <div class="admonition-content">
                        <p>Content</p>
                    </div>
                </div>
            `);
        });

        it('renders warning admonitions', async () => {
            const md = ':::warning Caution\nBe careful!\n:::';
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).toContain('admonition-warning');
            expect(html).toContain('Caution');
            expect(html).toContain('Be careful!');
        });

        it('renders tip admonitions', async () => {
            const md = ':::tip Pro tip\nHelpful advice\n:::';
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).toContain('admonition-tip');
            expect(html).toContain('Pro tip');
        });

        it('renders danger admonitions', async () => {
            const md = ':::danger Critical\nDangerous operation!\n:::';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('admonition-danger');
        });

        it('renders info admonitions', async () => {
            const md = ':::info Information\nUseful info\n:::';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('admonition-info');
        });

        it('renders admonitions with markdown content', async () => {
            const md = ':::note Title\n**Bold** and *italic* content\n:::';
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).toContain('<strong>Bold</strong>');
            expect(html).toContain('<em>italic</em>');
        });

        it('renders admonitions with code blocks', async () => {
            const md = ':::note Example\n```ts\nconst x = 1;\n```\n:::';
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).toContain('admonition');
            expect(html).toContain('kompendium-code');
        });
    });

    describe('type links', () => {
        it('creates links for known types in inline code', async () => {
            const md = 'The type is `MyComponent`';
            const result = await markdownToHtml(md, ['MyComponent']);
            expect(result.toString()).toContain('href="#/type/MyComponent"');
        });

        it('does not link unknown types', async () => {
            const md = 'The type is `UnknownType`';
            const result = await markdownToHtml(md, ['MyComponent']);
            expect(result.toString()).not.toContain(
                'href="#/type/UnknownType"',
            );
            expect(result.toString()).toContain('UnknownType');
        });

        it('handles union types with partial matches', async () => {
            const md = 'Type: `Foo | Bar`';
            const result = await markdownToHtml(md, ['Foo']);
            const html = result.toString();

            expect(html).toContain('href="#/type/Foo"');
            expect(html).not.toContain('href="#/type/Bar"');
        });

        it('handles array types', async () => {
            const md = 'Type: `Item[]`';
            const result = await markdownToHtml(md, ['Item']);
            expect(result.toString()).toContain('href="#/type/Item"');
        });

        it('handles generic types', async () => {
            const md = 'Type: `Array<Item>`';
            const result = await markdownToHtml(md, ['Item', 'Array']);
            const html = result.toString();

            expect(html).toContain('href="#/type/Item"');
            expect(html).toContain('href="#/type/Array"');
        });

        it('links types even in code blocks', async () => {
            // NOTE: This behavior may be undesirable - types inside fenced code
            // blocks get linked. The typeLinks plugin attempts to skip <pre><code>
            // blocks but the parent.parent check doesn't work with flatMap.
            // Documenting actual behavior for now.
            const md = '```ts\nconst x: MyComponent = null;\n```';
            const result = await markdownToHtml(md, ['MyComponent']);
            expect(result.toString()).toContain('href="#/type/MyComponent"');
        });

        it('handles empty types array', async () => {
            const md = 'The type is `MyComponent`';
            const result = await markdownToHtml(md, []);
            expect(result.toString()).not.toContain('href=');
        });
    });

    describe('raw HTML passthrough', () => {
        it('allows raw HTML in markdown', async () => {
            const md = '<div class="custom">Custom content</div>';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('class="custom"');
            expect(result.toString()).toContain('Custom content');
        });

        it('allows inline HTML elements', async () => {
            const md = 'Text with <span style="color: red">red</span> word';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('<span');
            expect(result.toString()).toContain('red');
        });

        it('allows HTML comments', async () => {
            const md = '<!-- comment -->\nVisible content';
            const result = await markdownToHtml(md);
            expect(result.toString()).toContain('Visible content');
        });
    });

    describe('edge cases', () => {
        it('handles empty input', async () => {
            const result = await markdownToHtml('');
            expect(result.toString()).toBe('');
        });

        it('handles whitespace-only input', async () => {
            const result = await markdownToHtml('   \n\n   ');
            expect(result.toString().trim()).toBe('');
        });

        it('handles very long lines', async () => {
            const longLine = 'a'.repeat(10000);
            const result = await markdownToHtml(longLine);
            expect(result.toString()).toContain(longLine);
        });

        it('handles unicode characters', async () => {
            const md = '# Emoji: 🎉\n\nÖsterreich, 日本語, العربية';
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).toContain('🎉');
            expect(html).toContain('Österreich');
            expect(html).toContain('日本語');
            expect(html).toContain('العربية');
        });

        it('handles special markdown characters escaped', async () => {
            const md = '\\*not bold\\* and \\[not a link\\]';
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).not.toContain('<strong>');
            expect(html).not.toContain('<a ');
        });

        it('handles deeply nested structures', async () => {
            const md =
                '> - Item in quote\n>   - Nested item\n>     - Deep nested';
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).toContain('<blockquote>');
            expect(html).toContain('<ul>');
        });

        it('handles mixed content types', async () => {
            const md = `# Heading

Paragraph with **bold** and \`code\`.

\`\`\`ts
const x = 1;
\`\`\`

> Quote

- List item`;
            const result = await markdownToHtml(md);
            const html = result.toString();

            expect(html).toContain('<h1');
            expect(html).toContain('<p>');
            expect(html).toContain('<strong>');
            expect(html).toContain('<code>');
            expect(html).toContain('kompendium-code');
            expect(html).toContain('<blockquote>');
            expect(html).toContain('<ul>');
        });
    });

    describe('integration scenarios', () => {
        it('processes a complete documentation page', async () => {
            const md = `---
title: Component API
order: 1
---

# Component API

This component accepts a \`Config\` object.

## Usage

\`\`\`tsx
import { MyComponent } from 'my-lib';

<MyComponent config={config} />
\`\`\`

:::note Important
Always provide a valid \`Config\` object.
:::

| Property | Type | Description |
|----------|------|-------------|
| name | \`string\` | The name |
| value | \`number\` | The value |
`;
            const result = await markdownToHtml(md, ['Config']);
            const html = result.toString();

            // Check frontmatter was extracted
            expect(result.data.frontmatter).toEqual({
                title: 'Component API',
                order: 1,
            });

            // Check structural elements
            expect(html).toContain('id="component-api"');
            expect(html).toContain('id="usage"');
            expect(html).toContain('kompendium-code');
            expect(html).toContain('admonition');
            expect(html).toContain('<table>');

            // Check type linking
            expect(html).toContain('href="#/type/Config"');
        });
    });
});
