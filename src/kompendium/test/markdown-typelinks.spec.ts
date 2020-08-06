import { splitTypeString, wrapText } from '../markdown-typelinks';

describe('splitTypeString()', () => {
    [
        {
            input: 'string',
            output: ['string'],
        },
        {
            input: 'string[]',
            output: ['string', '[]'],
        },
        {
            input: 'string | number',
            output: ['string', ' | ', 'number'],
        },
        {
            input: 'Array<string>',
            output: ['Array', '<', 'string', '>'],
        },
        {
            input: '{ foo: string }',
            output: ['{ ', 'foo', ': ', 'string', ' }'],
        },
    ].forEach(({ input, output }) => {
        describe(`when called with ${input}`, () => {
            it('correctly splits the string', () => {
                expect(splitTypeString(input)).toEqual(output);
            });
        });
    });
});

describe('wrapText()', () => {
    describe('when types exist in the string', () => {
        it('creates links to the types that exist', () => {
            const types = ['Foo'];
            const node = {
                type: 'text',
                value: 'Foo | Bar',
            };
            const result = wrapText(node, types);
            expect(result).toEqual([
                {
                    type: 'element',
                    tagName: 'a',
                    properties: {
                        href: '#/type/Foo',
                    },
                    children: [
                        {
                            type: 'text',
                            value: 'Foo',
                        },
                    ],
                },
                {
                    type: 'text',
                    value: ' | ',
                },
                {
                    type: 'text',
                    value: 'Bar',
                },
            ]);
        });
    });
});
