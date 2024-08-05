import { Component, h, Host, Prop, State } from '@stencil/core';
import { JsonDocsComponent } from '@stencil/core/internal';
import { JsonDocsSource } from '../../kompendium/source';
import { Theme, THEME_EVENT_NAME } from '../darkmode-switch/types';
import { PropsFactory } from './playground.types';

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
    public component: JsonDocsComponent;

    /**
     * Schema for the component
     */
    @Prop()
    public schema: Record<string, any>;

    /**
     * Factory for creating props for example components
     * @returns {Record<string, unknown>} props
     */
    @Prop()
    public propsFactory?: PropsFactory = () => ({});

    @State()
    private activeTab: string;

    @State()
    private theme: Theme;

    constructor() {
        this.renderTab = this.renderTab.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    public connectedCallback() {
        this.theme = document.querySelector('html').dataset.theme as Theme;
        document.addEventListener(THEME_EVENT_NAME, this.themeListener);
    }

    public disconnectedCallback() {
        document.removeEventListener(THEME_EVENT_NAME, this.themeListener);
    }

    public render(): HTMLElement {
        if (!this.component) {
            return;
        }

        const sources: JsonDocsSource[] = (this.component as any).sources || [];

        return (
            <Host data-theme={this.theme}>
                <section class="example">
                    <div class="result">{this.renderResult()}</div>

                    <aside class="code">
                        <nav class="tab-bar">{this.renderTabs(sources)}</nav>
                        <div class="tab-items">{this.renderItems(sources)}</div>
                    </aside>
                </section>
            </Host>
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
                <span>{source.filename}</span>
            </a>
        );
    }

    private renderItems(sources: JsonDocsSource[]) {
        return sources.map(this.renderItem);
    }

    private renderResult() {
        const ExampleComponent = this.component.tag;
        const text = '##### ' + this.component.docs;
        const factory = this.propsFactory;
        const props = {
            schema: this.schema,
            ...factory(ExampleComponent),
        };

        return (
            <div class="show-case">
                <div class="show-case_description">
                    <kompendium-markdown text={text} />
                </div>
                <div class="show-case_component">
                    {this.renderDebugButton(this.component.tag)}
                    <ExampleComponent {...props} />
                </div>
            </div>
        );
    }

    private renderItem(source: JsonDocsSource, index: number) {
        const classList = {
            'tab-item': true,
            active: this.isTabActive(source, index),
        };
        const code = source.source.replace(/\/\*\*.+?\*\//gms, '');
        const key = [this.component.tag, source.filename].join('/');

        return (
            <kompendium-code class={classList} language={source.type} key={key}>
                {code}
            </kompendium-code>
        );
    }

    private renderDebugButton(tag: string) {
        if (!['localhost', '127.0.0.1'].includes(location.hostname)) {
            return;
        }

        const href = `#/debug/${tag}`;

        return (
            <div class="debug">
                <a class="debug-link" href={href} title="Debug">
                    <svg
                        viewBox="0 0 400 400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="1.5"
                    >
                        <path fill="none" d="M0 0h400v400H0z" />
                        <path
                            d="M194.97 254.84h77.555"
                            fill="none"
                            stroke="currentColor"
                            stroke-opacity=".6"
                            stroke-width="20"
                        />
                        <path
                            d="M127.474 145.16l54.84 54.84M182.315 200l-54.84 54.84"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="20"
                        />
                    </svg>
                </a>
            </div>
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

    private themeListener = (event: CustomEvent<Theme>) => {
        this.theme = event.detail;
    };
}
