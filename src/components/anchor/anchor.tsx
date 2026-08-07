import { Component, h, Prop, State } from '@stencil/core';
import { anchorHref, currentRoute } from '../component/anchors';
import { getAnchorId } from '../anchor-scroll';

/**
 * Inline paragraph-link (¶) placed next to a heading. Picks up the parent
 * heading's font-size, stays hidden until the heading is hovered, and
 * highlights persistently when its slug matches the current URL anchor.
 * @private
 */
@Component({
    tag: 'kompendium-anchor',
    styleUrl: 'anchor.scss',
    shadow: true,
})
export class Anchor {
    /**
     * Slug used as the URL anchor fragment and scroll target.
     */
    @Prop()
    public slug: string;

    /**
     * Human-readable label for the target, used for the aria-label.
     */
    @Prop()
    public label: string;

    @State()
    private active = false;

    constructor() {
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    public connectedCallback(): void {
        this.updateActive();
        window.addEventListener('hashchange', this.handleHashChange);
    }

    public disconnectedCallback(): void {
        window.removeEventListener('hashchange', this.handleHashChange);
    }

    public render(): HTMLElement {
        return (
            <a
                class={{ anchor: true, active: this.active }}
                href={anchorHref(this.slug)}
                aria-label={`Link to ${this.label}`}
                onClick={this.handleClick}
            >
                ¶
            </a>
        );
    }

    private handleClick = (event: MouseEvent): void => {
        if (!this.active) {
            return;
        }

        event.preventDefault();
        const url = new URL(window.location.href);
        url.hash = currentRoute();
        history.replaceState(history.state, '', url);
        this.updateActive();
    };

    private handleHashChange(): void {
        this.updateActive();
    }

    private updateActive(): void {
        this.active = getAnchorId() === this.slug;
    }
}
