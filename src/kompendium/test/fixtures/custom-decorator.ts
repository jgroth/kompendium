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
