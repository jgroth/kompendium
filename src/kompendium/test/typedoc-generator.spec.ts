import { parseFile } from '../typedoc-generator';

describe('parseFile()', () => {
    it('returns the expected data when given basic input', () => {
        const data = parseFile('./src/kompendium/test/fixtures/basic.ts');
        expect(data).toEqual([
            {
                type: 'enum',
                name: 'Color',
                docs: 'The colors',
                docsTags: [],
                sources: ['src/kompendium/test/fixtures/basic.ts'],
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
                type: 'class',
                name: 'Zap',
                docs: 'The Zap class',
                docsTags: [
                    {
                        name: 'deprecated',
                        text: '',
                    },
                ],
                sources: ['src/kompendium/test/fixtures/basic.ts'],
                props: [
                    {
                        default: undefined,
                        docs: 'set if bar',
                        docsTags: [],
                        name: 'bar',
                        optional: true,
                        type: 'boolean',
                    },
                    {
                        default: undefined,
                        docs: 'foo is a string',
                        docsTags: [
                            {
                                name: 'deprecated',
                                text: 'this is not used',
                            },
                        ],
                        name: 'foo',
                        optional: false,
                        type: 'string',
                    },
                ],
                methods: [
                    {
                        docs: 'Do something\nFrom string to number',
                        docsTags: [
                            {
                                name: 'foobar',
                                text: 'baz',
                            },
                        ],
                        name: 'baz',
                        parameters: [
                            {
                                default: undefined,
                                docs: 'the string',
                                name: 'args',
                                optional: false,
                                type: 'string',
                            },
                        ],
                        returns: {
                            docs: 'the number',
                            type: 'number',
                        },
                    },
                ],
                typeParams: [],
                decorators: [
                    {
                        name: 'CustomDecorator',
                        arguments: { _config: "{ name: 'gg' }" },
                    },
                ],
            },
            {
                type: 'interface',
                name: 'Foo',
                typeParams: [],
                docs: 'This is Foo\nFoo is good',
                sources: ['src/kompendium/test/fixtures/basic.ts'],
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
                sources: ['src/kompendium/test/fixtures/basic.ts'],
                alias: 'Record<string, any>',
            },
        ]);
    });

    // it('returns the expected data when given advanced input', () => {
    //     const data = parseFile('./src/kompendium/test/fixtures/advanced.ts');
    //     console.log(JSON.stringify(data, null, '    '))
    // });
});
