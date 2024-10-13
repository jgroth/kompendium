import { DeclarationReflection, TypeParameterReflection } from 'typedoc';
import { getTypeParams } from './getTypeParams';

describe('getTypeParams()', () => {
    it('returns an empty array when there are no type parameters', () => {
        const reflection: Partial<DeclarationReflection> = {
            typeParameters: undefined,
        };
        const result = getTypeParams(reflection as DeclarationReflection);
        expect(result).toEqual([]);
    });

    it('processes a single type parameter', () => {
        const reflection: Partial<DeclarationReflection> = {
            typeParameters: [
                {
                    name: 'T',
                    comment: {
                        summary: [{ kind: 'text', text: 'the type' }],
                    },
                } as Partial<TypeParameterReflection> as TypeParameterReflection,
            ],
        };
        const result = getTypeParams(reflection as DeclarationReflection);
        expect(result).toEqual([{ name: 'T' }]);
    });

    it('processes multiple type parameters', () => {
        const reflection: Partial<DeclarationReflection> = {
            typeParameters: [
                {
                    name: 'T',
                    comment: {
                        summary: [{ kind: 'text', text: 'the first type' }],
                    },
                } as Partial<TypeParameterReflection> as TypeParameterReflection,
                {
                    name: 'U',
                    comment: {
                        summary: [{ kind: 'text', text: 'the second type' }],
                    },
                } as Partial<TypeParameterReflection> as TypeParameterReflection,
            ],
        };
        const result = getTypeParams(reflection as DeclarationReflection);
        expect(result).toEqual([{ name: 'T' }, { name: 'U' }]);
    });
});
