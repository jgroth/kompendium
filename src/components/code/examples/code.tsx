import { Component, h } from '@stencil/core';

const code = `
import foo from 'foo';

foo();
`;

/**
 * Very simple example of a code snippet
 */
@Component({
    tag: 'kompendium-example-code',
    shadow: true,
})
export class CodeExample {
    public render(): HTMLElement {
        return <kompendium-code language="ts">{code}</kompendium-code>;
    }
}
