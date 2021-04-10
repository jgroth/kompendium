import { JsonDocsComponent } from '@stencil/core/internal';
import { InterfaceDescription } from '../../types';
import { createSchemas } from '../schema';

describe('createSchemas()', () => {
    let components: JsonDocsComponent[] = [];
    let types: InterfaceDescription[] = [];

    describe('with empty inputs', () => {
        it('returns empty schemas', () => {
            expect(createSchemas(components, types)).toEqual([]);
        });
    });

    describe('with a simple component', () => {
        beforeEach(() => {
            components = [
                {
                    tag: 'example-component',
                    dirPath: '',
                    props: [],
                },
            ] as JsonDocsComponent[];
            types = [];
        });

        it('returns a valid schema', () => {
            expect(createSchemas(components, types)).toEqual([
                {
                    $id: 'example-component',
                    type: 'object',
                    properties: {},
                },
            ]);
        });

        describe('with one prop', () => {
            beforeEach(() => {
                components = [
                    {
                        tag: 'example-component',
                        dirPath: '',
                        props: [
                            {
                                type: 'string',
                                name: 'fooBar',
                                default: 'Foo',
                            },
                        ],
                    },
                ] as JsonDocsComponent[];
            });

            it('returns a valid schema', () => {
                expect(createSchemas(components, types)).toEqual([
                    {
                        $id: 'example-component',
                        type: 'object',
                        properties: {
                            fooBar: {
                                type: 'string',
                                title: 'Foo Bar',
                                default: 'Foo',
                            },
                        },
                    },
                ]);
            });
        });

        describe('with multiple props', () => {
            beforeEach(() => {
                components = [
                    {
                        tag: 'example-component',
                        dirPath: '',
                        props: [
                            {
                                type: 'string',
                                name: 'fooBar',
                                default: 'Foo',
                            },
                            {
                                type: 'boolean',
                                name: 'bar',
                                default: 'true',
                            },
                            {
                                type: 'number',
                                name: 'baz',
                                default: '15',
                            },
                        ],
                    },
                ] as JsonDocsComponent[];
            });

            it('returns a valid schema', () => {
                expect(createSchemas(components, types)).toEqual([
                    {
                        $id: 'example-component',
                        type: 'object',
                        properties: {
                            fooBar: {
                                type: 'string',
                                title: 'Foo Bar',
                                default: 'Foo',
                            },
                            bar: {
                                type: 'boolean',
                                title: 'Bar',
                                default: true,
                            },
                            baz: {
                                type: 'number',
                                title: 'Baz',
                                default: 15,
                            },
                        },
                    },
                ]);
            });
        });

        describe('with simple array props', () => {
            beforeEach(() => {
                components = [
                    {
                        tag: 'example-component',
                        dirPath: '',
                        props: [
                            {
                                type: 'string[]',
                                name: 'foos',
                            },
                            {
                                type: 'Array<number>',
                                name: 'bars',
                            },
                        ],
                    },
                ] as JsonDocsComponent[];
            });

            it('returns a valid schema', () => {
                expect(createSchemas(components, types)).toEqual([
                    {
                        $id: 'example-component',
                        type: 'object',
                        properties: {
                            foos: {
                                type: 'array',
                                title: 'Foos',
                                items: {
                                    type: 'string',
                                },
                            },
                            bars: {
                                type: 'array',
                                title: 'Bars',
                                items: {
                                    type: 'number',
                                },
                            },
                        },
                    },
                ]);
            });
        });

        describe('with simple object props', () => {
            beforeEach(() => {
                components = [
                    {
                        tag: 'example-component',
                        dirPath: '',
                        props: [
                            {
                                type: 'object',
                                name: 'foo',
                            },
                            {
                                type: 'Record<string, any>',
                                name: 'bar',
                            },
                        ],
                    },
                ] as JsonDocsComponent[];
            });

            it('returns a valid schema', () => {
                expect(createSchemas(components, types)).toEqual([
                    {
                        $id: 'example-component',
                        type: 'object',
                        properties: {
                            foo: {
                                type: 'object',
                                title: 'Foo',
                                additionalProperties: true,
                            },
                            bar: {
                                type: 'object',
                                title: 'Bar',
                                additionalProperties: true,
                            },
                        },
                    },
                ]);
            });
        });

        describe('with enum props', () => {
            beforeEach(() => {
                components = [
                    {
                        tag: 'example-component',
                        dirPath: '',
                        props: [
                            {
                                type: '"foo" | "bar"',
                                name: 'fooBar',
                            },
                        ],
                    },
                ] as JsonDocsComponent[];
            });

            it('returns a valid schema', () => {
                expect(createSchemas(components, types)).toEqual([
                    {
                        $id: 'example-component',
                        type: 'object',
                        properties: {
                            fooBar: {
                                type: 'string',
                                title: 'Foo Bar',
                                oneOf: [
                                    {
                                        type: 'string',
                                        const: 'foo',
                                        title: 'foo',
                                    },
                                    {
                                        type: 'string',
                                        const: 'bar',
                                        title: 'bar',
                                    },
                                ],
                            },
                        },
                    },
                ]);
            });
        });
    });

    describe('with a complex component', () => {
        beforeEach(() => {
            components = [
                {
                    tag: 'example-component',
                    dirPath: '',
                    props: [
                        {
                            type: 'ListItem',
                            name: 'foo',
                        },
                    ],
                },
            ] as JsonDocsComponent[];
            types = [
                {
                    name: 'ListItem',
                    type: 'interface',
                    typeParams: [
                        {
                            name: 'T',
                        },
                    ],
                    props: [
                        {
                            name: 'disabled',
                            type: 'boolean',
                        },
                        {
                            name: 'icon',
                            type: 'string',
                        },
                        {
                            name: 'value',
                            type: 'T',
                        },
                    ],
                },
            ] as InterfaceDescription[];
        });

        it('returns a valid schema', () => {
            expect(createSchemas(components, types)).toEqual([
                {
                    $id: 'example-component',
                    type: 'object',
                    properties: {
                        foo: {
                            type: 'object',
                            title: 'Foo',
                            $ref: '#/definitions/ListItem',
                        },
                    },
                    definitions: {
                        ListItem: {
                            type: 'object',
                            properties: {
                                disabled: {
                                    type: 'boolean',
                                    title: 'Disabled',
                                },
                                icon: {
                                    type: 'string',
                                    title: 'Icon',
                                },
                                value: {
                                    type: 'object',
                                    title: 'Value',
                                    additionalProperties: true,
                                },
                            },
                        },
                    },
                },
            ]);
        });

        describe('with a list of objects', () => {
            beforeEach(() => {
                components = [
                    {
                        tag: 'example-component',
                        dirPath: '',
                        props: [
                            {
                                type: 'ListItem[]',
                                name: 'foo',
                            },
                            {
                                type: 'ListItem<any>[]',
                                name: 'bar',
                            },
                        ],
                    },
                ] as JsonDocsComponent[];
            });

            it('returns a valid schema', () => {
                expect(createSchemas(components, types)).toEqual([
                    {
                        $id: 'example-component',
                        type: 'object',
                        properties: {
                            foo: {
                                type: 'array',
                                title: 'Foo',
                                items: {
                                    type: 'object',
                                    $ref: '#/definitions/ListItem',
                                },
                            },
                            bar: {
                                type: 'array',
                                title: 'Bar',
                                items: {
                                    type: 'object',
                                    $ref: '#/definitions/ListItem',
                                },
                            },
                        },
                        definitions: {
                            ListItem: {
                                type: 'object',
                                properties: {
                                    disabled: {
                                        type: 'boolean',
                                        title: 'Disabled',
                                    },
                                    icon: {
                                        type: 'string',
                                        title: 'Icon',
                                    },
                                    value: {
                                        type: 'object',
                                        title: 'Value',
                                        additionalProperties: true,
                                    },
                                },
                            },
                        },
                    },
                ]);
            });
        });

        describe('when unused types are provided', () => {
            beforeEach(() => {
                types = [
                    ...types,
                    {
                        name: 'FooBar',
                        type: 'interface',
                        props: [
                            {
                                name: 'name',
                                type: 'string',
                            },
                        ],
                    } as any,
                ];
            });

            it('does not include the unused types in the schema', () => {
                const schema: any[] = createSchemas(components, types);

                expect(Object.keys(schema[0].definitions)).toEqual([
                    'ListItem',
                ]);
            });
        });
    });
});
