import { MenuItem } from '../../types';
import { createDocuments } from '../search';

xdescribe('Array.from(new Menu())', () => {
    const tests: TestSpec[] = [
        {
            input: [],
            output: [],
        },
        {
            input: [{ path: 'foo' }],
            output: [{ path: 'foo' }],
        },
        {
            input: [{ path: 'foo' }, { path: 'bar' }],
            output: [{ path: 'foo' }, { path: 'bar' }],
        },
        {
            input: [{ path: 'foo', children: [{ path: 'foo.bar' }] }],
            output: [{ path: 'foo.bar' }],
        },
        {
            input: [
                { path: 'foo', children: [] },
                {
                    path: 'bar',
                    children: [
                        {
                            path: 'bar.baz',
                            children: [{ path: 'bar.baz.qux' }],
                        },
                    ],
                },
                { path: 'baz', children: [{ path: 'baz.qux' }] },
            ],
            output: [
                { path: 'foo' },
                { path: 'bar.baz.qux' },
                { path: 'baz.qux' },
            ],
        },
    ];

    tests.forEach(({ input, output }) => {
        it(`returns ${JSON.stringify(output)} when called with ${JSON.stringify(
            input,
        )}`, async () => {
            expect(Array.from(createDocuments(input, {} as any))).toEqual(
                output,
            );
        });
    });
});

interface TestSpec {
    input: MenuItem[];
    output: MenuItem[];
}
