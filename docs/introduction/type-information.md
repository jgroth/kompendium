# Type information

Kompendium can generate documentation about any custom Typescript types that you use in your components. You might have props or events that implement a custom interface and this should be documented as well so it is easy for the consumer of your components to use them.

### Configuration

All types needs to be exported from a single file. The default name of this file is `./src/types.ts`, but this can be configured if needed.

{% code title="stencil.config.ts" %}
```typescript
{
    type: 'docs-custom',
    strict: true,
    generator: kompendium({
        typeRoot: './src/interface.d.ts'
    })
}
```
{% endcode %}

{% hint style="info" %}
This file should also be exported from the `index.ts` file so type hints will be available when consuming the components in a code editor.
{% endhint %}

### Example

{% code title="my-component.tsx" %}
```typescript
import { Component, h, Prop } from '@stencil/core';
import { MyData } from './my-data.ts';

/**
 * This is a sample component
 * 
 * Kompendium will parse the doc blocks and render it using Markdown
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
    public data: MyData;

    render() {
        return <p>Hello, {this.data.name}!</p>;
    }
}
```
{% endcode %}

{% code title="my-data.ts" %}
```typescript
/**
 * This is a custom interface used in `my-component`
 */
export interface MyData {
    /**
     * The name to display when the component renders
     */
    name: string;
}
```
{% endcode %}

{% code title="interface.d.ts" %}
```typescript
export * from './my-component/my-data.ts';
```
{% endcode %}

