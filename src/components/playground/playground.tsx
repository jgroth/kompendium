import { Component, h, Prop, State } from '@stencil/core';
import { JsonDocsComponent } from '@stencil/core/internal';
import { JsonDocsSource } from '../../kompendium/source';

@Component({
    tag: 'kompendium-playground',
    styleUrl: 'playground.scss',
    shadow: true
})
export class Playground {

    @Prop()
    public component: JsonDocsComponent;

    @State()
    private activeTab: string = 'result';

    constructor() {
        this.renderTab = this.renderTab.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    public render() {
        const sources: JsonDocsSource[] = this.component['sources'] || [];

        return (
            <section class="tab-panel">
                <nav class="tab-bar">
                    {this.renderTabs(sources)}
                    <span/>
                </nav>
                <div class="tab-items">
                    {this.renderItems(sources)}
                </div>
            </section>
        );
    }

    private renderTabs(sources: JsonDocsSource[]) {
        const classList = {
            'tab': true,
            'active': this.activeTab === 'result'
        };

        return [
            <button class={classList} onClick={this.activateTab('result')}>
                Result
            </button>,
            ...sources.map(this.renderTab)
        ];
    }

    private renderTab(source: JsonDocsSource) {
        const classList = {
            'tab': true,
            'active': this.activeTab === source.type
        };

        return (
            <button class={classList} onClick={this.activateTab(source.type)}>
                {source.type}
            </button>
        );
    }

    private renderItems(sources: JsonDocsSource[]) {
        const Component = this.component.tag;
        const classList = {
            'tab-item': true,
            'active': this.activeTab === 'result'
        };

        return [
            <Component class={classList}/>,
            ...sources.map(this.renderItem)
        ];
    }

    private renderItem(source: JsonDocsSource) {
        const classList = {
            'tab-item': true,
            'active': this.activeTab === source.type
        };

        return (
            <kompendium-code class={classList} language={source.type} code={source.source} />
        );
    }

    private activateTab = (id: string) => () => {
        this.activeTab = id;
    };
}
