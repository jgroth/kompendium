import { Comment, CommentTag, Reflection } from 'typedoc';
import { getDocsTags } from './getDocsTags';

describe('getDocsTags()', () => {
    it('returns an empty array when there are no block tags', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [],
            } as Comment,
        };
        const result = getDocsTags(input as Reflection);
        expect(result).toEqual([]);
    });

    it('processes a single block tag with no content', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [
                    {
                        skipRendering: false,
                        tag: '@deprecated',
                        content: [],
                    } as Partial<CommentTag> as CommentTag,
                ],
            } as Comment,
        };
        const result = getDocsTags(input as Reflection);
        expect(result).toEqual([{ name: 'deprecated', text: '' }]);
    });

    it('processes a single block tag with content', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [
                    {
                        skipRendering: false,
                        tag: '@sourceFile',
                        content: [
                            {
                                kind: 'text',
                                text: 'src/kompendium/test/fixtures/class.ts',
                            },
                        ],
                    } as Partial<CommentTag> as CommentTag,
                ],
            } as Comment,
        };
        const result = getDocsTags(input as Reflection);
        expect(result).toEqual([
            {
                name: 'sourceFile',
                text: 'src/kompendium/test/fixtures/class.ts',
            },
        ]);
    });

    it('processes multiple block tags correctly', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [
                    {
                        skipRendering: false,
                        tag: '@deprecated',
                        content: [{ kind: 'text', text: 'this is not used' }],
                    } as Partial<CommentTag> as CommentTag,
                    {
                        skipRendering: false,
                        tag: '@sourceFile',
                        content: [
                            {
                                kind: 'text',
                                text: 'src/kompendium/test/fixtures/interface.ts',
                            },
                        ],
                    } as Partial<CommentTag> as CommentTag,
                ],
            } as Comment,
        };
        const result = getDocsTags(input as Reflection);
        expect(result).toEqual([
            { name: 'deprecated', text: 'this is not used' },
            {
                name: 'sourceFile',
                text: 'src/kompendium/test/fixtures/interface.ts',
            },
        ]);
    });

    it('ignores @param and @returns tags', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [
                    {
                        skipRendering: false,
                        tag: '@param',
                        content: [{ kind: 'text', text: 'ignored param' }],
                    } as Partial<CommentTag> as CommentTag,
                    {
                        skipRendering: false,
                        tag: '@returns',
                        content: [{ kind: 'text', text: 'ignored returns' }],
                    } as Partial<CommentTag> as CommentTag,
                    {
                        skipRendering: false,
                        tag: '@sourceFile',
                        content: [
                            {
                                kind: 'text',
                                text: 'src/kompendium/test/fixtures/basic.ts',
                            },
                        ],
                    } as Partial<CommentTag> as CommentTag,
                ],
            } as Comment,
        };
        const result = getDocsTags(input as Reflection);
        expect(result).toEqual([
            {
                name: 'sourceFile',
                text: 'src/kompendium/test/fixtures/basic.ts',
            },
        ]);
    });
});
