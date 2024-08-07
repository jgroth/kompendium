import { Component, h, Prop, State } from '@stencil/core';
import { KompendiumData } from '../../types';

@Component({
    tag: 'kompendium-guide',
    shadow: true,
})
export class Guide {
    /**
     */
    @Prop()
    public data: KompendiumData;

    @State()
    public route: string;

    private text: string;

    constructor() {
        this.setRoute = this.setRoute.bind(this);
    }

    protected connectedCallback(): void {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }

    protected disconnectedCallback(): void {
        window.removeEventListener('hashchange', this.setRoute);
    }

    private setRoute() {
        this.route = location.hash.replace('#', '');
    }

    render(): HTMLElement {
        this.findGuide();

        return <kompendium-markdown text={this.text} />;
    }

    private findGuide() {
        const guide = this.data.guides.find(
            (g) => g.data.path + '/' === this.route,
        );

        if (guide) {
            this.text = guide.content;
        }
    }
}
