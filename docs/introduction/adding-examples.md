# Adding examples

To improve the documentation even more, you can add examples of how to use your components. An example component is just another component that displays how your component is used. The example will be displayed both live and with the source code for the example.

To include an example, the custom `@exampleComponent` doc block decorator should be used together with the name of the component. There is no limit to the number of components you can include.

{% code title="my-component.tsx" %}
```typescript
import { Component, h, Prop } from '@stencil/core';

/**
 * This is a sample component
 * 
 * Kompendium will parse the doc blocks and render it using Markdown
 *
 * @exampleComponent my-component-example
 */
@Component({
    tag: 'my-component',
    shadow: true,
})
export class MyComponent {
    /**
     * This is a sample property
     */
    @Prop()
    public name: string;

    render() {
        return <p>Hello, {this.name}!</p>;
    }
}
```
{% endcode %}

The example component in this case is very simple

{% code title="my-component-example.tsx" %}
```typescript
import { Component, h } from '@stencil/core';

/**
 * This is an example for the `my-component` component
 */
@Component({
    tag: 'my-component-example',
    shadow: true,
})
export class MyComponentExample {
    render() {
        return <my-component name="World" />;
    }
}
```
{% endcode %}

It's recomended to either name all the examples in a similar fashion, or to place them in an `examples/` folder or similar. This way, it's very easy to exclude them from the production build by excluding them in the Stencil configuration.

