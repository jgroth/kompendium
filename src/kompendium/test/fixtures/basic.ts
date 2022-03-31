type DecoratorConfig = {
    /**
     * This is the name
     */
    name: string;
};

/**
 * Use this!
 *
 * @param {DecoratorConfig} _config how to use it
 * @returns {ClassDecorator} the decorator
 */
const CustomDecorator = (_config: DecoratorConfig): ClassDecorator => {
    return () => {};
};

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

/**
 * The Zap class
 *
 * @deprecated
 */
@CustomDecorator({ name: 'gg' })
export class Zap implements Foo {
    /**
     * @inheritdoc
     */
    foo: string;

    /**
     * @inheritdoc
     */
    bar?: boolean;

    /**
     * @inheritdoc
     */
    baz: (args: string) => number;
}
