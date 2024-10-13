import {
    Comment,
    SignatureReflection,
    CommentTag,
    IntrinsicType,
    CommentDisplayPart,
} from 'typedoc';
import { getReturns } from './getReturns';

describe('getReturns()', () => {
    it('returns an empty docs string when there is no @returns tag', () => {
        const signature: Partial<SignatureReflection> = {
            type: createMockedIntrinsicType('number'),
            comment: undefined,
        };
        const result = getReturns(signature as SignatureReflection);
        expect(result).toEqual({
            type: 'number',
            docs: '',
        });
    });

    it('processes a return type with @returns tag', () => {
        const signature: Partial<SignatureReflection> = {
            type: createMockedIntrinsicType('number'),
            comment: {
                blockTags: [
                    {
                        tag: '@returns',
                        content: [
                            {
                                kind: 'text',
                                text: 'the number',
                            } as CommentDisplayPart,
                        ],
                    } as Partial<CommentTag> as CommentTag,
                ],
            } as Comment,
        };
        const result = getReturns(signature as SignatureReflection);
        expect(result).toEqual({
            type: 'number',
            docs: 'the number',
        });
    });

    it('processes an empty @returns tag correctly', () => {
        const signature: Partial<SignatureReflection> = {
            type: createMockedIntrinsicType('number'),
            comment: {
                blockTags: [
                    {
                        tag: '@returns',
                        content: [],
                    } as Partial<CommentTag> as CommentTag,
                ],
            } as Comment,
        };
        const result = getReturns(signature as SignatureReflection);
        expect(result).toEqual({
            type: 'number',
            docs: '',
        });
    });

    it('processes a return type without a comment', () => {
        const signature: Partial<SignatureReflection> = {
            type: createMockedIntrinsicType('number'),
            comment: undefined,
        };
        const result = getReturns(signature as SignatureReflection);
        expect(result).toEqual({
            type: 'number',
            docs: '',
        });
    });
});

function createMockedIntrinsicType(name: string): IntrinsicType {
    return {
        name: name,
        type: 'intrinsic',
        toString: () => name,
    } as IntrinsicType;
}
