import { Component, h, Prop, State } from '@stencil/core';
import { getHashPath } from './route-matching';

/**
 * Custom route switch component for Kompendium
 * Manages navigation state and passes current path to child routes
 */
@Component({
    tag: 'kompendium-route-switch',
    shadow: false,
})
export class KompendiumRouteSwitch {
    @Prop()
    public scrollTopOffset?: number = 0;

    @State()
    private currentPath: string = '/';

    constructor() {
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    connectedCallback(): void {
        window.addEventListener('hashchange', this.handleHashChange);
        this.handleHashChange();
    }

    disconnectedCallback(): void {
        window.removeEventListener('hashchange', this.handleHashChange);
    }

    private handleHashChange(): void {
        const newPath = getHashPath();
        if (newPath !== this.currentPath) {
            this.currentPath = newPath;
            if (this.scrollTopOffset !== undefined) {
                window.scrollTo(0, this.scrollTopOffset);
            }
        }
    }

    render() {
        // Simply render child routes
        // The @State currentPath will trigger re-render when hash changes
        // Each route component will re-render and check if it matches
        return <slot />;
    }
}
