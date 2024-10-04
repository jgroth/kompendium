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
 * The Zap class, decorated with `CustomDecorator`
 * @deprecated
 */
@CustomDecorator({ name: 'gg' })
export class Zap {
    /**
     * description of foo
     * @deprecated this is not used
     */
    foo: string;

    /**
     * description of bar
     */
    bar?: boolean;

    /**
     * Convert string to number
     * @param {string} args the string
     * @returns {number} the number
     * @foobar baz
     */
    baz: (args: string) => number;
}
