import { generateComponentKey } from './component-key';

describe('component-key', () => {
    describe('generateComponentKey()', () => {
        it('returns empty string for empty params', () => {
            const key = generateComponentKey({});

            expect(key).toBe('');
        });

        it('generates key for single parameter', () => {
            const key = generateComponentKey({ id: '123' });

            expect(key).toBe('id=123');
        });

        it('generates key for multiple parameters', () => {
            const key = generateComponentKey({ id: '123', name: 'test' });

            expect(key).toBe('id=123&name=test');
        });

        it('sorts parameters alphabetically', () => {
            const key = generateComponentKey({
                zebra: 'z',
                apple: 'a',
                banana: 'b',
            });

            expect(key).toBe('apple=a&banana=b&zebra=z');
        });

        it('generates deterministic keys (same input produces same output)', () => {
            const params = { foo: 'bar', baz: 'qux' };

            const key1 = generateComponentKey(params);
            const key2 = generateComponentKey(params);

            expect(key1).toBe(key2);
        });

        it('generates deterministic keys regardless of insertion order', () => {
            const params1 = { a: '1', b: '2', c: '3' };
            const params2 = { c: '3', a: '1', b: '2' };

            const key1 = generateComponentKey(params1);
            const key2 = generateComponentKey(params2);

            expect(key1).toBe(key2);
            expect(key1).toBe('a=1&b=2&c=3');
        });

        it('generates different keys for different parameter values', () => {
            const key1 = generateComponentKey({ id: '123' });
            const key2 = generateComponentKey({ id: '456' });

            expect(key1).not.toBe(key2);
        });

        it('generates different keys for different parameter names', () => {
            const key1 = generateComponentKey({ id: '123' });
            const key2 = generateComponentKey({ name: '123' });

            expect(key1).not.toBe(key2);
        });

        it('handles empty parameter values', () => {
            const key = generateComponentKey({ id: '', name: 'test' });

            expect(key).toBe('id=&name=test');
        });

        it('handles parameter values with special characters', () => {
            const key = generateComponentKey({ id: 'user-123_test' });

            expect(key).toBe('id=user-123_test');
        });

        it('handles parameter values with hyphens', () => {
            const key = generateComponentKey({ name: 'my-component' });

            expect(key).toBe('name=my-component');
        });

        it('handles parameter values with spaces', () => {
            const key = generateComponentKey({ query: 'hello world' });

            expect(key).toBe('query=hello world');
        });

        it('handles parameter values with URL-like characters', () => {
            const key = generateComponentKey({ path: '/foo/bar' });

            expect(key).toBe('path=/foo/bar');
        });

        it('handles numeric string values', () => {
            const key = generateComponentKey({ userId: '123', postId: '456' });

            expect(key).toBe('postId=456&userId=123');
        });

        it('handles multiple parameters with empty values', () => {
            const key = generateComponentKey({ a: '', b: '', c: 'value' });

            expect(key).toBe('a=&b=&c=value');
        });

        it('generates key compatible with query string format', () => {
            const key = generateComponentKey({
                name: 'kompendium-app',
                section: 'properties',
            });

            expect(key).toBe('name=kompendium-app&section=properties');
            expect(key).toContain('&');
            expect(key.split('&').length).toBe(2);
        });

        it('handles real-world route parameters', () => {
            const key = generateComponentKey({
                name: 'kompendium-component',
                section: 'methods',
            });

            expect(key).toBe('name=kompendium-component&section=methods');
        });
    });
});
