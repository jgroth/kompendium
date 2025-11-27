import { Component, h } from '@stencil/core';

/**
 * Custom router component for Kompendium
 * Manages routing state using hash-based navigation
 */
@Component({
    tag: 'kompendium-router',
    shadow: false,
})
export class KompendiumRouter {
    render() {
        return <slot />;
    }
}
