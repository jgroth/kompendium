/**
 * This is Foo
 *
 * Foo is good
 * @sourceFile foobar
 */
export interface Foo {
    /**
     * foo is a string
     * @deprecated this is not used
     */
    foo: string;

    /**
     * set if bar
     */
    bar?: boolean;

    /**
     * Do something
     *
     * From string to number
     * @param {string} args the string
     * @returns {number} the number
     * @sourceFile src/kompendium/test/fixtures/class-implementing-interface.ts
     */
    baz: (args: string) => number;
}

/**
 * The Zap class, implementing Foo
 * @deprecated
 */
export class Zap implements Foo {
    /**
     * @inheritDoc
     */
    foo: string;

    /**
     * @inheritDoc
     */
    bar?: boolean;

    /**
     * @inheritDoc
     */
    baz: (args: string) => number;
}
