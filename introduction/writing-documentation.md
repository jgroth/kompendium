# Writing documentation

The generated documentation is fetched from the doc blocks inside the components source files. If we would have a component like the one below, it would generate the corresponding documentation. Kompendium understands how to read Markdown, so any additional markup will automatically be parsed.

{% code title="my-component.tsx" %}
```typescript
import { Component, h, Prop } from '@stencil/core';

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
    public name: string;

    render() {
        return <p>Hello, {this.name}!</p>;
    }
}
```
{% endcode %}

