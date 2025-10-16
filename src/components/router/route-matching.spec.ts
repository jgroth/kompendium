import { parseRoute, matchRoute, getHashPath } from './route-matching';

describe('router-utils', () => {
    describe('parseRoute()', () => {
        it('parses basic path without parameters', () => {
            const result = parseRoute('/users');

            expect(result.params).toEqual([]);
            expect(result.regex.test('/users')).toBe(true);
            expect(result.regex.test('/users/123')).toBe(false);
        });

        it('parses path with single required parameter', () => {
            const result = parseRoute('/users/:id');

            expect(result.params).toEqual(['id']);
            expect(result.regex.test('/users/123')).toBe(true);
            expect(result.regex.test('/users')).toBe(false);
        });

        it('parses path with multiple required parameters', () => {
            const result = parseRoute('/users/:userId/posts/:postId');

            expect(result.params).toEqual(['userId', 'postId']);
            expect(result.regex.test('/users/123/posts/456')).toBe(true);
            expect(result.regex.test('/users/123/posts')).toBe(false);
        });

        it('parses path with single optional parameter', () => {
            const result = parseRoute('/component/:name/:section?');

            expect(result.params).toEqual(['name', 'section']);
            expect(result.regex.test('/component/foo/bar')).toBe(true);
            expect(result.regex.test('/component/foo/bar/')).toBe(true);
            expect(result.regex.test('/component/foo/')).toBe(true);
            // Optional param means both the slash and value are optional
            expect(result.regex.test('/component/foo')).toBe(true);
        });

        it('parses path with only optional parameter', () => {
            const result = parseRoute('/search/:query?');

            expect(result.params).toEqual(['query']);
            expect(result.regex.test('/search/test')).toBe(true);
            expect(result.regex.test('/search/test/')).toBe(true);
            expect(result.regex.test('/search/')).toBe(true);
            // Slash is also optional for optional param
            expect(result.regex.test('/search')).toBe(true);
        });

        it('handles trailing slash in pattern', () => {
            const result = parseRoute('/type/:name/');

            expect(result.params).toEqual(['name']);
            expect(result.regex.test('/type/foo/')).toBe(true);
            // Trailing slash in pattern still added optional slash at end
            expect(result.regex.test('/type/foo//')).toBe(true);
        });

        it('maintains parameter order', () => {
            const result = parseRoute('/a/:first/b/:second?/c/:third');

            expect(result.params).toEqual(['first', 'second', 'third']);
        });
    });

    describe('matchRoute()', () => {
        it('returns null when path does not match pattern', () => {
            const result = matchRoute('/users', '/posts');

            expect(result).toBeNull();
        });

        it('returns empty params for basic path match', () => {
            const result = matchRoute('/users', '/users');

            expect(result).toEqual({ params: {} });
        });

        it('extracts single required parameter', () => {
            const result = matchRoute('/users/123', '/users/:id');

            expect(result).toEqual({ params: { id: '123' } });
        });

        it('extracts multiple required parameters', () => {
            const result = matchRoute(
                '/users/123/posts/456',
                '/users/:userId/posts/:postId',
            );

            expect(result).toEqual({
                params: { userId: '123', postId: '456' },
            });
        });

        it('extracts optional parameter when present', () => {
            const result = matchRoute(
                '/component/foo/bar',
                '/component/:name/:section?',
            );

            expect(result).toEqual({
                params: { name: 'foo', section: 'bar' },
            });
        });

        it('extracts optional parameter as empty string when absent with trailing slash', () => {
            const result = matchRoute(
                '/component/foo/',
                '/component/:name/:section?',
            );

            expect(result).toEqual({
                params: { name: 'foo', section: '' },
            });
        });

        it('extracts optional parameter as empty string when absent without trailing slash', () => {
            const result = matchRoute(
                '/component/foo',
                '/component/:name/:section?',
            );

            expect(result).toEqual({
                params: { name: 'foo', section: '' },
            });
        });

        it('handles path with trailing slash matching pattern without', () => {
            const result = matchRoute('/type/MyType/', '/type/:name');

            expect(result).toEqual({ params: { name: 'MyType' } });
        });

        it('handles path without trailing slash for required parameter', () => {
            const result = matchRoute('/type/MyType', '/type/:name');

            expect(result).toEqual({ params: { name: 'MyType' } });
        });

        it('handles pattern with extra trailing slash', () => {
            const result = matchRoute('/type/MyType//', '/type/:name/');

            expect(result).toEqual({ params: { name: 'MyType' } });
        });

        it('returns empty params object for catch-all route (no pattern)', () => {
            const result = matchRoute('/any/path', '');

            expect(result).toEqual({ params: {} });
        });

        it('extracts parameters with special characters', () => {
            const result = matchRoute('/users/user-123_test', '/users/:id');

            expect(result).toEqual({ params: { id: 'user-123_test' } });
        });

        it('does not match partial paths', () => {
            const result = matchRoute('/users/123/extra', '/users/:id');

            expect(result).toBeNull();
        });

        it('matches root path', () => {
            const result = matchRoute('/', '/');

            expect(result).toEqual({ params: {} });
        });

        it('handles complex real-world route pattern', () => {
            const result = matchRoute(
                '/component/kompendium-app/properties',
                '/component/:name/:section?',
            );

            expect(result).toEqual({
                params: { name: 'kompendium-app', section: 'properties' },
            });
        });

        it('handles parameter values with hyphens and underscores', () => {
            const result = matchRoute(
                '/debug/my-custom_component',
                '/debug/:name',
            );

            expect(result).toEqual({
                params: { name: 'my-custom_component' },
            });
        });
    });

    describe('getHashPath()', () => {
        const originalLocation = window.location;

        beforeEach(() => {
            delete (window as any).location;
            window.location = { ...originalLocation, hash: '' } as Location;
        });

        afterEach(() => {
            window.location = originalLocation;
        });

        it('returns path from hash', () => {
            window.location.hash = '#/users';

            expect(getHashPath()).toBe('/users');
        });

        it('returns path from hash with parameters', () => {
            window.location.hash = '#/users/123/posts/456';

            expect(getHashPath()).toBe('/users/123/posts/456');
        });

        it('returns root path when hash is empty', () => {
            window.location.hash = '';

            expect(getHashPath()).toBe('/');
        });

        it('returns root path when hash is only #', () => {
            window.location.hash = '#';

            expect(getHashPath()).toBe('/');
        });

        it('handles hash with query parameters', () => {
            window.location.hash = '#/search?q=test';

            expect(getHashPath()).toBe('/search?q=test');
        });

        it('handles hash with trailing slash', () => {
            window.location.hash = '#/users/';

            expect(getHashPath()).toBe('/users/');
        });
    });
});
