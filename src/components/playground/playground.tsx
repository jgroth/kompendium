import { Component, h, Prop, State } from '@stencil/core';
import { JsonDocsComponent } from '@stencil/core/internal';
import { JsonDocsSource } from '../../kompendium/source';
import { kompendium } from '../../kompendium';

@Component({
    tag: 'kompendium-playground',
    styleUrl: 'playground.scss',
    shadow: true
})
export class Playground {

    @Prop()
    public component: JsonDocsComponent;

    @State()
    private activeTab = 1;

    constructor() {
        this.renderItem = this.renderItem.bind(this) ;
    }

    render() {
        const sources: JsonDocsSource[] = this.component['sources'] || [];
        const tabs = this.renderTabs();

        return (
            <section class="tab-panel">
                <nav class="tab-bar">
                    {tabs}
                </nav>
                <div class="tab-items">
                    {sources.map(this.renderItem)}
                </div>
            </section>
        );
    }

    private renderTabs() {
        const sources: JsonDocsSource[] = this.component['sources'] || [];
        return [
            <button>Result</button>,
            ...sources.map(source => <button>{source.type}</button>)
        ];
    }

    private renderItem(source: JsonDocsSource) {
        const Component = this.component.tag;
        return [
            <Component />,
            <kompendium-code language={source.type} code={source.source} />
        ]
    }
}
