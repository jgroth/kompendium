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
    public component: JsonDocsComponent = {} as any;

    @State()
    private activeTab: string = 'result';

    constructor() {
        this.renderTab = this.renderTab.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    public render() {
        if (!this.component) {
            return;
        }

        const sources: JsonDocsSource[] = this.component['sources'] || [];

        return (
            <section class="tab-panel">
                <nav class="tab-bar">
                    {this.renderTabs(sources)}
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
            <a class={classList} onClick={this.activateTab('result')}>
                Result
            </a>,
            ...sources.map(this.renderTab)
        ];
    }

    private renderTab(source: JsonDocsSource) {
        const classList = {
            'tab': true,
            'active': this.activeTab === source.type
        };

        return (
            <a class={classList} onClick={this.activateTab(source.type)}>
                {source.type}
            </a>
        );
    }

    private renderItems(sources: JsonDocsSource[]) {
        return [
            this.renderResult(),
            ...sources.map(this.renderItem)
        ];
    }

    private renderResult() {
        const Component = this.component.tag;
        const classList = {
            'tab-item': true,
            'active': this.activeTab === 'result'
        };

        return (
            <div class={classList}>
                <kompendium-markdown text={this.component.docs} />
                <Component />
            </div>
        );

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
