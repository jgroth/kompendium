import { Component, h, Prop, Element, State } from '@stencil/core';
import { getHashPath, matchRoute, MatchResults } from './route-matching';
import { hasPreviousMatchingSibling } from './route-switch-logic';
import { generateComponentKey } from './component-key';

/**
 * Custom route component for Kompendium
 * Renders a component when the route matches
 */
@Component({
    tag: 'kompendium-route',
    shadow: false,
})
export class KompendiumRoute {
    @Element()
    private el: HTMLElement;

    @State()
    private currentPath: string = '/';

    @Prop()
    public url?: string;

    @Prop()
    public component?: string;

    @Prop()
    public componentProps?: Record<string, any>;

    @Prop()
    public exact?: boolean = false;

    @Prop()
    public routeRender?: (props: { match: MatchResults }) => any;

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
        this.currentPath = getHashPath();
    }

    render() {
        // Use current path from state (updated by hashchange listener)
        const currentPath = this.currentPath;

        // Check if a previous sibling route matches (first-match wins)
        if (hasPreviousMatchingSibling(this.el, currentPath)) {
            return null;
        }

        // Check if this route matches
        let match: MatchResults;
        if (this.url) {
            match = matchRoute(currentPath, this.url);
        } else {
            match = { params: {} }; // Catch-all route
        }

        if (!match) {
            return null;
        }

        // Render the matched route
        if (this.routeRender) {
            return this.routeRender({ match: match });
        }

        if (this.component) {
            const props = {
                ...this.componentProps,
                match: match,
            };

            // Create element dynamically using h() with string tag name
            // Use match params as key to force recreation when params change
            const key = generateComponentKey(match.params);

            return h(this.component, { key: key, ...props });
        }

        return <slot />;
    }
}
