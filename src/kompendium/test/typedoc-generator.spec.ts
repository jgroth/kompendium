import { parseFile } from '../typedoc-generator';

describe('parseFile()', () => {
    it('returns the expected data for a simple type alias', async () => {
        const data = await parseFile(
            './src/kompendium/test/fixtures/type-alias.ts',
        );
        expect(data).toEqual([
            {
                type: 'alias',
                name: 'Bar',
                docs: 'The bar',
                docsTags: [],
                sources: ['src/kompendium/test/fixtures/type-alias.ts'],
                alias: 'Record<string, any>',
            },
        ]);
    });

    it('returns the expected data for an enum', async () => {
        const data = await parseFile('./src/kompendium/test/fixtures/enum.ts');
        expect(data).toEqual([
            {
                type: 'enum',
                name: 'Color',
                docs: 'The colors',
                docsTags: [],
                sources: ['src/kompendium/test/fixtures/enum.ts'],
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
        ]);
    });

    it('returns the expected data for a simple class', async () => {
        const data = await parseFile('./src/kompendium/test/fixtures/class.ts');
        expect(data).toEqual([
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
                sources: ['src/kompendium/test/fixtures/class.ts'],
                props: [
                    {
                        default: undefined,
                        docs: 'description of bar',
                        docsTags: [],
                        name: 'bar',
                        optional: true,
                        type: 'boolean',
                    },
                    {
                        default: undefined,
                        docs: 'description of foo',
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
                        docs: 'Convert string to number',
                        docsTags: [
                            {
                                name: 'sourceFile',
                                text: 'src/kompendium/test/fixtures/class.ts',
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
            },
        ]);
    });

    it('returns the expected data for an interface', async () => {
        const data = await parseFile(
            './src/kompendium/test/fixtures/interface.ts',
        );
        expect(data).toEqual([
            {
                type: 'interface',
                name: 'Foo',
                typeParams: [],
                docs: 'This is Foo\n\nFoo is good',
                sources: ['src/kompendium/test/fixtures/interface.ts'],
                docsTags: [
                    {
                        name: 'sourceFile',
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
                        docs: 'Do something\n\nFrom string to number',
                        docsTags: [
                            {
                                name: 'sourceFile',
                                text: 'src/kompendium/test/fixtures/interface.ts',
                            },
                        ],
                        returns: {
                            type: 'number',
                            docs: 'the number',
                        },
                    },
                ],
            },
        ]);
    });

    it('returns the expected data for a decorated class', async () => {
        const data = await parseFile(
            './src/kompendium/test/fixtures/decorated-class.ts',
        );
        expect(data).toEqual([
            {
                type: 'class',
                name: 'Zap',
                docs: 'The Zap class, decorated with `CustomDecorator`',
                docsTags: [
                    {
                        name: 'deprecated',
                        text: '',
                    },
                ],
                sources: ['src/kompendium/test/fixtures/decorated-class.ts'],
                props: [
                    {
                        default: undefined,
                        docs: 'description of bar',
                        docsTags: [],
                        name: 'bar',
                        optional: true,
                        type: 'boolean',
                    },
                    {
                        default: undefined,
                        docs: 'description of foo',
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
                        docs: 'Convert string to number',
                        docsTags: [
                            {
                                name: 'sourceFile',
                                text: 'src/kompendium/test/fixtures/decorated-class.ts',
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
                // decorators: [
                //     {
                //         name: 'CustomDecorator',
                //         arguments: { _config: "{ name: 'gg' }" },
                //     },
                // ],
            },
        ]);
    });

    it('returns the expected data for a class implementing an interface', async () => {
        const data = await parseFile(
            './src/kompendium/test/fixtures/class-implementing-interface.ts',
        );
        expect(data).toEqual([
            {
                type: 'class',
                name: 'Zap',
                docs: 'The Zap class, implementing Foo',
                docsTags: [
                    {
                        name: 'deprecated',
                        text: '',
                    },
                ],
                sources: [
                    'src/kompendium/test/fixtures/class-implementing-interface.ts',
                ],
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
                        docs: 'Do something\n\nFrom string to number',
                        docsTags: [
                            {
                                name: 'sourceFile',
                                text: 'src/kompendium/test/fixtures/class-implementing-interface.ts',
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
            },
            {
                type: 'interface',
                name: 'Foo',
                typeParams: [],
                docs: 'This is Foo\n\nFoo is good',
                sources: [
                    'src/kompendium/test/fixtures/class-implementing-interface.ts',
                ],
                docsTags: [
                    {
                        name: 'sourceFile',
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
                        docs: 'Do something\n\nFrom string to number',
                        docsTags: [
                            {
                                name: 'sourceFile',
                                text: 'src/kompendium/test/fixtures/class-implementing-interface.ts',
                            },
                        ],
                        returns: {
                            type: 'number',
                            docs: 'the number',
                        },
                    },
                ],
            },
        ]);
    });

    it('returns the expected data when given basic input', async () => {
        const data = await parseFile('./src/kompendium/test/fixtures/basic.ts');
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
                docs: 'This is a generic class with two type parameters',
                docsTags: [],
                methods: [],
                name: 'Pair',
                props: [
                    {
                        default: undefined,
                        docs: 'the first value',
                        docsTags: [],
                        name: 'first',
                        optional: false,
                        type: 'T',
                    },
                    {
                        default: undefined,
                        docs: 'the second value',
                        docsTags: [],
                        name: 'second',
                        optional: false,
                        type: 'U',
                    },
                ],
                sources: ['src/kompendium/test/fixtures/basic.ts'],
                type: 'class',
                typeParams: [
                    {
                        name: 'T',
                    },
                    {
                        name: 'U',
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
                        docs: 'Do something\n\nFrom string to number',
                        docsTags: [
                            {
                                name: 'sourceFile',
                                text: 'src/kompendium/test/fixtures/basic.ts',
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
                // decorators: [
                //     {
                //         name: 'CustomDecorator',
                //         arguments: { _config: "{ name: 'gg' }" },
                //     },
                // ],
            },
            {
                docs: 'This is a generic interface with a type parameter',
                docsTags: [],
                methods: [],
                name: 'Container',
                props: [
                    {
                        default: undefined,
                        docs: '',
                        docsTags: [],
                        name: 'value',
                        optional: false,
                        type: 'T',
                    },
                ],
                sources: ['src/kompendium/test/fixtures/basic.ts'],
                type: 'interface',
                typeParams: [
                    {
                        name: 'T',
                    },
                ],
            },
            {
                type: 'interface',
                name: 'Foo',
                typeParams: [],
                docs: 'This is Foo\n\nFoo is good',
                sources: ['src/kompendium/test/fixtures/basic.ts'],
                docsTags: [
                    {
                        name: 'sourceFile',
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
                        docs: 'Do something\n\nFrom string to number',
                        docsTags: [
                            {
                                name: 'sourceFile',
                                text: 'src/kompendium/test/fixtures/basic.ts',
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

    // it('returns the expected data when given advanced input', async () => {
    //     const data = await parseFile('./src/kompendium/test/fixtures/advanced.ts');
    //     console.log(JSON.stringify(data, null, '    '))
    // });
});
