import type { Node, Parent } from 'unist';
import {
    inlineLinks,
    LinkResolver,
    normalizeInlineLinkUrls,
} from '../markdown-inline-links';

function paragraph(...children: Node[]): Parent {
    return { type: 'paragraph', children: children };
}

function text(value: string): Node {
    return { type: 'text', value: value };
}

function inlineCode(value: string): Node {
    return { type: 'inlineCode', value: value };
}

function tree(...children: Parent[]): Parent {
    return { type: 'root', children: children };
}

function run(input: Parent, resolve: LinkResolver = () => null): Parent {
    inlineLinks({ resolve: resolve })(input);

    return input;
}

describe('inlineLinks()', () => {
    describe('when there are no {@link} references', () => {
        it('leaves the tree alone', () => {
            const result = run(tree(paragraph(text('Just prose.'))));
            expect(result.children[0]).toEqual(paragraph(text('Just prose.')));
        });
    });

    describe('when the resolver recognises the target', () => {
        const resolve: LinkResolver = (target) =>
            target === 'Rule' ? '#/type/Rule' : null;

        it('rewrites a bare {@link Target} and wraps the identifier in code', () => {
            const result = run(
                tree(paragraph(text('See {@link Rule} now.'))),
                resolve,
            );
            expect(result.children[0]).toEqual(
                paragraph(
                    text('See '),
                    {
                        type: 'link',
                        url: '#/type/Rule',
                        title: null,
                        children: [inlineCode('Rule')],
                    },
                    text(' now.'),
                ),
            );
        });

        it('uses the space-separated display text', () => {
            const result = run(
                tree(paragraph(text('See {@link Rule the rule type}.'))),
                resolve,
            );
            const para = result.children[0] as Parent;
            const link = para.children[1] as Parent & { url: string };
            expect(link.type).toEqual('link');
            expect(link.url).toEqual('#/type/Rule');
            expect(link.children).toEqual([text('the rule type')]);
        });

        it('uses the pipe-separated display text', () => {
            const result = run(
                tree(paragraph(text('See {@link Rule | the rule type}.'))),
                resolve,
            );
            const para = result.children[0] as Parent;
            const link = para.children[1] as Parent & { url: string };
            expect(link.type).toEqual('link');
            expect(link.url).toEqual('#/type/Rule');
            expect(link.children).toEqual([text('the rule type')]);
        });

        it('rewrites multiple references in the same text node', () => {
            const result = run(
                tree(
                    paragraph(text('{@link Rule} and {@link Rule | another}.')),
                ),
                resolve,
            );
            const para = result.children[0] as Parent;
            expect(para.children).toHaveLength(4);
            expect((para.children[0] as any).url).toEqual('#/type/Rule');
            expect((para.children[0] as any).children).toEqual([
                inlineCode('Rule'),
            ]);
            expect((para.children[1] as any).value).toEqual(' and ');
            expect((para.children[2] as any).url).toEqual('#/type/Rule');
            expect((para.children[2] as any).children).toEqual([
                text('another'),
            ]);
        });
    });

    describe('when the resolver returns null', () => {
        it('renders the bare identifier as inline code, not the raw syntax', () => {
            const result = run(tree(paragraph(text('See {@link Unknown}.'))));
            expect(result.children[0]).toEqual(
                paragraph(text('See '), inlineCode('Unknown'), text('.')),
            );
        });

        it('renders a free-form label as plain prose, no code wrapping', () => {
            const result = run(
                tree(paragraph(text('See {@link Unknown the missing one}.'))),
            );
            expect(result.children[0]).toEqual(
                paragraph(text('See '), text('the missing one'), text('.')),
            );
        });
    });

    describe('when the target is an absolute URL', () => {
        it('links to it directly without consulting the resolver', () => {
            const resolve = jest.fn();
            const result = run(
                tree(
                    paragraph(
                        text('See {@link https://example.com | the docs}.'),
                    ),
                ),
                resolve as unknown as LinkResolver,
            );
            const para = result.children[0] as Parent;
            const link = para.children[1] as any;
            expect(link.type).toEqual('link');
            expect(link.url).toEqual('https://example.com');
            expect(link.children).toEqual([text('the docs')]);
            expect(resolve).not.toHaveBeenCalled();
        });
    });

    describe('when given a malformed reference (no closing brace)', () => {
        // Regression guard for catastrophic regex backtracking (ReDoS): an
        // unterminated `{@link X` followed by a long whitespace run used to
        // make the matcher run super-linearly on the render thread (thousands
        // of spaces froze the page for seconds). It must now fail to match
        // promptly and leave the text untouched.
        const unterminated = `{@link X${' '.repeat(50000)}`;

        it('returns promptly without rewriting (mdast plugin)', () => {
            const resolve: LinkResolver = () => '#/type/X';
            const start = Date.now();
            const result = run(tree(paragraph(text(unterminated))), resolve);
            expect(Date.now() - start).toBeLessThan(100);
            // No `}`, so nothing matches: the text node is left as-is.
            expect(result.children[0]).toEqual(paragraph(text(unterminated)));
        });

        it('returns promptly without rewriting (URL pre-pass)', () => {
            const start = Date.now();
            const result = normalizeInlineLinkUrls(
                `{@link https://example.com${' '.repeat(50000)}`,
            );
            expect(Date.now() - start).toBeLessThan(100);
            expect(result).toEqual(
                `{@link https://example.com${' '.repeat(50000)}`,
            );
        });

        // The whitespace cases above are terminated by the first space (which
        // ends the target class), so they never exercise a long *unbroken*
        // target. A single long run with no whitespace/`|`/`}` is the input
        // that triggers the overlapping-quantifier backtracking the lookahead
        // in the patterns guards against — these cover that path directly.
        const longUnbrokenTarget = `{@link ${'a'.repeat(50000)}`;

        it('returns promptly on a long unbroken target (mdast plugin)', () => {
            const resolve: LinkResolver = () => '#/type/X';
            const start = Date.now();
            const result = run(
                tree(paragraph(text(longUnbrokenTarget))),
                resolve,
            );
            expect(Date.now() - start).toBeLessThan(100);
            expect(result.children[0]).toEqual(
                paragraph(text(longUnbrokenTarget)),
            );
        });

        it('returns promptly on a long unbroken target (URL pre-pass)', () => {
            const unterminatedUrl = `{@link http://${'a'.repeat(50000)}`;
            const start = Date.now();
            const result = normalizeInlineLinkUrls(unterminatedUrl);
            expect(Date.now() - start).toBeLessThan(100);
            expect(result).toEqual(unterminatedUrl);
        });

        // A distinct super-linear shape from the single long token above: a
        // terminator-free span packed with many `{@link` near-misses. Each
        // `exec` start would scan its tail to end-of-string, making a
        // multi-start scan quadratic. The bounded tail (no newlines, capped
        // length) keeps every start's scan bounded so the pass stays linear.
        // Both a single line and a newline-separated run are exercised.
        //
        // The input is sized so a quadratic regression takes several seconds
        // (~5.7s locally for this many tokens) while the linear pass stays in
        // the tens of milliseconds. The bound is deliberately generous: it must
        // tolerate a heavily-loaded CI runner (where even the linear pass can
        // take a few hundred ms) yet still fail loudly on an O(n^2) regression.
        const NEAR_MISS_COUNT = 40000;
        const LINEAR_BUDGET_MS = 3000;
        const manyNearMisses = '{@link a '.repeat(NEAR_MISS_COUNT);
        const manyNearMissesMultiline = '{@link a \n'.repeat(NEAR_MISS_COUNT);

        it('returns promptly on many single-line near-misses (mdast plugin)', () => {
            const resolve: LinkResolver = () => '#/type/X';
            const start = Date.now();
            const result = run(tree(paragraph(text(manyNearMisses))), resolve);
            expect(Date.now() - start).toBeLessThan(LINEAR_BUDGET_MS);
            expect(result.children[0]).toEqual(paragraph(text(manyNearMisses)));
        });

        it('returns promptly on many multi-line near-misses (mdast plugin)', () => {
            const resolve: LinkResolver = () => '#/type/X';
            const start = Date.now();
            const result = run(
                tree(paragraph(text(manyNearMissesMultiline))),
                resolve,
            );
            expect(Date.now() - start).toBeLessThan(LINEAR_BUDGET_MS);
            expect(result.children[0]).toEqual(
                paragraph(text(manyNearMissesMultiline)),
            );
        });

        it('returns promptly on many near-misses (URL pre-pass)', () => {
            const manyUrlNearMisses = '{@link http://a '.repeat(
                NEAR_MISS_COUNT,
            );
            const start = Date.now();
            const result = normalizeInlineLinkUrls(manyUrlNearMisses);
            expect(Date.now() - start).toBeLessThan(LINEAR_BUDGET_MS);
            expect(result).toEqual(manyUrlNearMisses);
        });
    });

    describe('normalizeInlineLinkUrls()', () => {
        it('rewrites a bare URL reference to a markdown link', () => {
            expect(
                normalizeInlineLinkUrls('See {@link https://example.com}.'),
            ).toEqual('See [https://example.com](https://example.com).');
        });

        it('uses a pipe-separated label', () => {
            expect(
                normalizeInlineLinkUrls(
                    'See {@link https://example.com | the docs}.',
                ),
            ).toEqual('See [the docs](https://example.com).');
        });

        it('uses a space-separated label', () => {
            expect(
                normalizeInlineLinkUrls(
                    'See {@link https://example.com the docs}.',
                ),
            ).toEqual('See [the docs](https://example.com).');
        });

        it('leaves non-URL references untouched', () => {
            expect(normalizeInlineLinkUrls('See {@link Rule}.')).toEqual(
                'See {@link Rule}.',
            );
        });
    });

    describe('when the text node already lives inside a link', () => {
        it('does not introduce a nested link', () => {
            const resolve: LinkResolver = () => '#/type/Rule';
            const link: Parent = {
                type: 'link',
                children: [text('A {@link Rule} inside a link')],
            };
            const result = run(tree(paragraph(link)), resolve);
            const para = result.children[0] as Parent;
            const outerLink = para.children[0] as Parent;
            expect(outerLink.type).toEqual('link');
            expect(outerLink.children).toEqual([
                text('A {@link Rule} inside a link'),
            ]);
        });
    });
});
