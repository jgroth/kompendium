import { Component, h, Prop, State } from '@stencil/core';
import { JsonDocsComponent } from '@stencil/core/internal';
import { JsonDocsSource } from '../../kompendium/source';

@Component({
    tag: 'kompendium-playground',
    styleUrl: 'playground.scss',
    shadow: true,
})
export class Playground {
    /**
     * The component to display
     */
    @Prop()
    public component: JsonDocsComponent = {} as any;

    @State()
    private activeTab: string;

    constructor() {
        this.renderTab = this.renderTab.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    public render(): HTMLElement {
        if (!this.component) {
            return;
        }

        const sources: JsonDocsSource[] = this.component['sources'] || [];

        return (
            <section class="example">
                <div class="result">{this.renderResult()}</div>

                <aside class="code">
                    <nav class="tab-bar">{this.renderTabs(sources)}</nav>
                    <div class="tab-items">{this.renderItems(sources)}</div>
                </aside>
            </section>
        );
    }

    private renderTabs(sources: JsonDocsSource[]) {
        return sources.map(this.renderTab);
    }

    private renderTab(source: JsonDocsSource, index: number) {
        const classList = {
            tab: true,
            active: this.isTabActive(source, index),
        };

        return (
            <a class={classList} onClick={this.activateTab(source.filename)}>
                {source.filename}
            </a>
        );
    }

    private renderItems(sources: JsonDocsSource[]) {
        return sources.map(this.renderItem);
    }

    private renderResult() {
        const ExampleComponent = this.component.tag;
        const text = '##### ' + this.component.docs;

        return (
            <div>
                <kompendium-markdown text={text} />
                <ExampleComponent />
            </div>
        );
    }

    private renderItem(source: JsonDocsSource, index: number) {
        const classList = {
            'tab-item': true,
            active: this.isTabActive(source, index),
        };
        const code = source.source.replace(/\/\*\*.+?\*\//gms, '');

        return (
            <kompendium-code
                random={Math.random()}
                class={classList}
                language={source.type}
            >
                {code}
            </kompendium-code>
        );
    }

    private activateTab = (id: string) => () => {
        this.activeTab = id;
    };

    private isTabActive(source: JsonDocsSource, index: number): boolean {
        let isActive = this.activeTab === source.filename;
        if (!isActive) {
            isActive = index === 0 && !this.activeTab;
        }

        return isActive;
    }
}
