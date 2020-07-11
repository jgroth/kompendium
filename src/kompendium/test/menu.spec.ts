import { addGuide } from '../menu';

describe('addGuide', () => {
    [
        {
            menu: [],
            guide: {
                data: { frontmatter: { path: '/guide/test' } },
                content: '# My test guide',
            },
            result: [
                {
                    path: '/guide',
                    title: 'Guide',
                    children: [
                        {
                            children: [],
                            path: '/guide/test',
                            title: 'My test guide',
                        },
                    ],
                },
            ],
        },
        {
            menu: [],
            guide: {
                data: { frontmatter: { path: '/guide/test/foo' } },
                content: '# My test guide',
            },
            result: [
                {
                    path: '/guide',
                    title: 'Guide',
                    children: [
                        {
                            path: '/guide/test',
                            title: 'Test',
                            children: [
                                {
                                    children: [],
                                    title: 'My test guide',
                                    path: '/guide/test/foo',
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
});
