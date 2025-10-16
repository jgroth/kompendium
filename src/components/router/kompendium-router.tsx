import { Component, h, Prop } from '@stencil/core';

/**
 * Custom router component for Kompendium
 * Manages routing state using hash-based navigation
 */
@Component({
    tag: 'kompendium-router',
    shadow: false,
})
export class KompendiumRouter {
    @Prop()
    public historyType: 'hash' | 'browser' = 'hash';

    render() {
        return <slot />;
    }
}
