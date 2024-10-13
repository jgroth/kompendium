import {
    SignatureReflection,
    ParameterReflection,
    IntrinsicType,
    Comment,
} from 'typedoc';
import { getParameters } from './getParameters';

describe('getParameters()', () => {
    it('returns an empty array when there are no parameters', () => {
        const signature: Partial<SignatureReflection> = {
            parameters: [],
        };
        const result = getParameters(signature as SignatureReflection);
        expect(result).toEqual([]);
    });

    it('processes a parameter with a comment', () => {
        const signature: Partial<SignatureReflection> = {
            parameters: [
                {
                    name: 'args',
                    type: createMockedIntrinsicType('string'),
                    comment: {
                        summary: [{ kind: 'text', text: 'the string' }],
                    } as Comment,
                    defaultValue: undefined,
                    flags: { isOptional: false },
                } as Partial<ParameterReflection> as ParameterReflection,
            ],
        };
        const result = getParameters(signature as SignatureReflection);
        expect(result).toEqual([
            {
                name: 'args',
                type: 'string',
                docs: 'the string',
                default: undefined,
                optional: false,
            },
        ]);
    });

    it('processes a parameter without a comment', () => {
        const signature: Partial<SignatureReflection> = {
            parameters: [
                {
                    name: 'args',
                    type: createMockedIntrinsicType('string'),
                    comment: undefined,
                    defaultValue: undefined,
                    flags: { isOptional: false },
                } as Partial<ParameterReflection> as ParameterReflection,
            ],
        };
        const result = getParameters(signature as SignatureReflection);
        expect(result).toEqual([
            {
                name: 'args',
                type: 'string',
                docs: '',
                default: undefined,
                optional: false,
            },
        ]);
    });

    it('processes multiple parameters correctly', () => {
        const signature: Partial<SignatureReflection> = {
            parameters: [
                {
                    name: 'firstParam',
                    type: createMockedIntrinsicType('string'),
                    comment: {
                        summary: [{ kind: 'text', text: 'the first string' }],
                    } as Comment,
                    defaultValue: undefined,
                    flags: { isOptional: false },
                } as Partial<ParameterReflection> as ParameterReflection,
                {
                    name: 'secondParam',
                    type: createMockedIntrinsicType('number'),
                    comment: {
                        summary: [{ kind: 'text', text: 'the second number' }],
                    } as Comment,
                    defaultValue: undefined,
                    flags: { isOptional: true },
                } as Partial<ParameterReflection> as ParameterReflection,
            ],
        };
        const result = getParameters(signature as SignatureReflection);
        expect(result).toEqual([
            {
                name: 'firstParam',
                type: 'string',
                docs: 'the first string',
                default: undefined,
                optional: false,
            },
            {
                name: 'secondParam',
                type: 'number',
                docs: 'the second number',
                default: undefined,
                optional: true,
            },
        ]);
    });
});

function createMockedIntrinsicType(name: string): IntrinsicType {
    return {
        name: name,
        type: 'intrinsic',
        toString: () => name,
    } as IntrinsicType;
}
