import { parseFile } from '../typedoc';

describe('parseFile()', () => {
    it('returns the expected data when given basic input', () => {
        const data = parseFile('./src/kompendium/test/fixtures/basic.ts');
        expect(data).toEqual([
            {
                type: 'enum',
                name: 'Color',
                docs: 'The colors',
                docsTags: [],
                members: [
                    {
                        name: 'Blue',
                        value: '"blue"',
                        docs: 'Almost blue',
                        docsTags: [],
                    },
                    {
                        name: 'Green',
                        value: '"green"',
                        docs: 'Looks like green',
                        docsTags: [],
                    },
                    {
                        name: 'Red',
                        value: '"red"',
                        docs: 'The red color',
                        docsTags: [],
                    },
                ],
            },
            {
                type: 'interface',
                name: 'Foo',
                typeParams: [],
                docs: 'This is Foo\nFoo is good',
                docsTags: [
                    {
                        name: 'foo',
                        text: 'foobar',
                    },
                ],
                props: [
                    {
                        name: 'bar',
                        type: 'boolean',
                        docs: 'set if bar',
                        docsTags: [],
                        default: undefined,
                        optional: true,
                    },
                    {
                        name: 'foo',
                        type: 'string',
                        docs: 'foo is a string',
                        docsTags: [
                            {
                                name: 'deprecated',
                                text: 'this is not used',
                            },
                        ],
                        default: undefined,
                        optional: false,
                    },
                ],
                methods: [
                    {
                        name: 'baz',
                        parameters: [
                            {
                                name: 'args',
                                type: 'string',
                                optional: false,
                                docs: 'the string',
                                default: undefined,
                            },
                        ],
                        docs: 'Do something\nFrom string to number',
                        docsTags: [
                            {
                                name: 'foobar',
                                text: 'baz',
                            },
                        ],
                        returns: {
                            type: 'number',
                            docs: 'the number',
                        },
                    },
                ],
            },
            {
                type: 'alias',
                name: 'Bar',
                docs: 'The bar',
                docsTags: [],
                alias: 'Record<string, any>',
            },
        ]);
    });

    // it('returns the expected data when given advanced input', () => {
    //     const data = parseFile('./src/kompendium/test/fixtures/advanced.ts');
    //     console.log(JSON.stringify(data, null, '    '))
    // });
});
