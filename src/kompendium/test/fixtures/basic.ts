/**
 * This is Foo
 *
 * Foo is good
 *
 * @foo foobar
 */
export interface Foo {
    /**
     * foo is a string
     *
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
     *
     * @param {string} args the string
     * @returns {number} the number
     * @foobar baz
     */
    baz: (args: string) => number;
}

/**
 * The bar
 */
export type Bar = Record<string, any>;

/**
 * The colors
 */
export enum Color {
    /**
     * The red color
     */
    Red = 'red',

    /**
     * Looks like green
     */
    Green = 'green',

    /**
     * Almost blue
     */
    Blue = 'blue',
}
