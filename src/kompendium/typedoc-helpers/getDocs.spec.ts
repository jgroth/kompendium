import { Comment, Reflection } from 'typedoc';
import { getDocs } from './getDocs';

describe('getDocs()', () => {
    it('returns the correct docs string for a single summary part', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [],
                modifierTags: new Set(),
                summary: [{ kind: 'text', text: 'The bar' }],
            } as Comment,
        };
        const result = getDocs(input as Reflection);
        expect(result).toEqual('The bar');
    });

    it('returns an empty string when summary is missing', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [],
                modifierTags: new Set(),
            } as Comment,
        };
        const result = getDocs(input as Reflection);
        expect(result).toEqual('');
    });

    it('concatenates multiple summary parts correctly', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [],
                modifierTags: new Set(),
                summary: [
                    { kind: 'text', text: 'First part' },
                    { kind: 'text', text: 'Second part' },
                ],
            } as Comment,
        };
        const result = getDocs(input as Reflection);
        expect(result).toEqual('First part Second part');
    });

    it('handles line breaks correctly in the summary', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [],
                modifierTags: new Set(),
                summary: [{ kind: 'text', text: 'First line\nSecond line' }],
            } as Comment,
        };
        const result = getDocs(input as Reflection);
        expect(result).toEqual('First line\nSecond line');
    });

    it('handles different summary kinds', () => {
        const input: Partial<Reflection> = {
            comment: {
                blockTags: [],
                modifierTags: new Set(),
                summary: [
                    { kind: 'text', text: 'This is text ' },
                    { kind: 'code', text: '`code`' },
                ],
            } as Comment,
        };
        const result = getDocs(input as Reflection);
        expect(result).toEqual('This is text `code`');
    });
});
