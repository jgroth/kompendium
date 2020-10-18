import { KompendiumGuide, MenuItem } from '../../types';
import { addGuide } from '../menu';

describe('addGuide', () => {
    [
        {
            menu: [],
            guide: {
                data: { path: '/guide/test' },
                content: '# My test guide',
            },
            result: [
                {
                    path: '/guide/',
                    title: 'Guide',
                    children: [
                        {
                            children: [],
                            path: '/guide/test/',
                            title: 'My test guide',
                        },
                    ],
                },
            ],
        },
        {
            menu: [],
            guide: {
                data: { path: '/guide/test/foo' },
                content: '# My test guide',
            },
            result: [
                {
                    path: '/guide/',
                    title: 'Guide',
                    children: [
                        {
                            path: '/guide/test/',
                            title: 'Test',
                            children: [
                                {
                                    children: [],
                                    title: 'My test guide',
                                    path: '/guide/test/foo/',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ].forEach(({ menu, guide, result }) => {
        it('adds the guide to the menu', () => {
            addGuide(menu, '')(guide);
            expect(menu).toEqual(result);
        });
    });

    describe('foo', () => {
        const guides: KompendiumGuide[] = [
            {
                data: { path: '/guide/foo' },
                content: '# Foo',
            },
            {
                data: { path: '/guide/bar' },
                content: '# Bar',
            },
        ];
        const menu: MenuItem[] = [];
        const result: MenuItem[] = [
            {
                path: '/guide/',
                title: 'Guide',
                children: [
                    {
                        path: '/guide/foo/',
                        title: 'Foo',
                        children: [],
                    },
                    {
                        path: '/guide/bar/',
                        title: 'Bar',
                        children: [],
                    },
                ],
            },
        ];

        guides.forEach(addGuide(menu, ''));
        expect(menu).toEqual(result);
    });
});
