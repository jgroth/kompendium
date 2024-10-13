/* eslint-disable max-classes-per-file */

type DecoratorConfig = {
    /**
     * This is the name
     */
    name: string;
};

/**
 * Use this!
 * @param {DecoratorConfig} _config how to use it
 * @returns {ClassDecorator} the decorator
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CustomDecorator = (_config: DecoratorConfig): ClassDecorator => {
    return () => {};
};

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
     * @sourceFile src/kompendium/test/fixtures/basic.ts
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

/**
 * The Zap class
 * @deprecated
 */
@CustomDecorator({ name: 'gg' })
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

/**
 * This is a generic interface with a type parameter
 * @template T the type
 */
export interface Container<T> {
    value: T;
}

/**
 * This is a generic class with two type parameters
 * @template T the first type
 * @template U the second type
 */
export class Pair<T, U> {
    /**
     * The constructor
     * @param {T} first the first value
     * @param {U} second the second value
     */
    constructor(
        public first: T,
        public second: U,
    ) {}

    /**
     * Get the first value
     * @returns {T} the first value
     */
    public getFirst(): T {
        return this.first;
    }
}

/**
 * This is a function with a type parameter
 * @param {T} arg the argument
 * @returns {T} the same argument
 */
export function identity<T>(arg: T): T {
    return arg;
}
