import { Component, h, Prop, State, Element } from '@stencil/core';
import { JsonDocs } from '@stencil/core/internal';
import { MatchResults } from '@stencil/router';
import { PropertyList } from './templates/props';
import { EventList } from './templates/events';
import { MethodList } from './templates/methods';
import { SlotList } from './templates/slots';
import { StyleList } from './templates/style';

@Component({
    tag: 'maki-component',
    shadow: true,
    styleUrl: 'component.scss'
})
export class MakiComponent {

    @Prop()
    public docs: JsonDocs;

    @Prop()
    public match: MatchResults;

    @Element()
    private host: HTMLElement;

    constructor() {
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    protected componentWillLoad() {
        window.addEventListener('hashchange', this.handleRouteChange);
    }

    protected componentDidUnload() {
        window.removeEventListener('hashchange', this.handleRouteChange);
    }

    protected componentDidLoad() {
        const route = this.getRoute();
        this.scrollToElement(route);
    }

    private handleRouteChange() {
        const route = this.getRoute();
        this.scrollToElement(route);
    }

    private scrollToElement(id: string) {
        const element = this.host.shadowRoot.getElementById(id);
        if (!element) {
            return;
        }

        element.scrollIntoView();
    }

    public render() {
        return (
            <article class="component">
                <section class="docs">
                    {this.renderDocs()}
                </section>
                <aside class="examples">
                    {this.renderExamples()}
                </aside>
            </article>
        );
    }

    private renderDocs() {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);

        let title = tag.split('-').slice(1).join(' ');
        title = title[0].toLocaleUpperCase() + title.slice(1);

        return [
            <h1 id={this.getId()}>{title}</h1>,
            <maki-markdown text={component.docs}/>,
            <maki-taglist tags={component.docsTags.filter(tag => tag.name !== 'slot')} />,
            <PropertyList props={component.props} id={this.getId('properties')} />,
            <EventList events={component.events} id={this.getId('events')} />,
            <MethodList methods={component.methods} id={this.getId('methods')} />,
            <SlotList slots={component.slots} id={this.getId('slots')} />,
            <StyleList styles={component.styles} id={this.getId('styles')} />
        ];
    }

    private renderExamples() {
        return '';
    }

    private getId(name?: string) {
        const route = this.getRoute().split('/').slice(0, 3).join('/');
        return [route, name].filter(item => !!item).join('/');
    }

    private getRoute() {
        return location.hash.substr(1);
    }
}

function findComponent(tag: string, docs: JsonDocs) {
    return docs.components.find(doc => doc.tag === tag);
}
