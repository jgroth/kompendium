import { Component, h, Prop, Element } from '@stencil/core';
import {
    JsonDocs,
    JsonDocsComponent,
    JsonDocsTag,
} from '@stencil/core/internal';
import { MatchResults } from '@stencil/router';
import { PropertyList } from './templates/props';
import { EventList } from './templates/events';
import { MethodList } from './templates/methods';
import { SlotList } from './templates/slots';
import { StyleList } from './templates/style';
import { ExampleList, isExampleTag } from './templates/examples';
import negate from 'lodash/negate';

@Component({
    tag: 'kompendium-component',
    shadow: true,
    styleUrl: 'component.scss',
})
export class KompendiumComponent {
    /**
     * The generated documentation data
     */
    @Prop()
    public docs: JsonDocs;

    /**
     * Matched route parameters
     */
    @Prop()
    public match: MatchResults;

    @Element()
    private host: HTMLKompendiumComponentElement;

    constructor() {
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    protected componentWillLoad(): void {
        window.addEventListener('hashchange', this.handleRouteChange);
    }

    protected componentDidUnload(): void {
        window.removeEventListener('hashchange', this.handleRouteChange);
    }

    protected componentDidLoad(): void {
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

    public render(): HTMLElement {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);

        return (
            <article class="component">
                <section class="docs">
                    {this.renderDocs(tag, component)}
                </section>
            </article>
        );
    }

    private renderDocs(tag: string, component: JsonDocsComponent) {
        let title = tag.split('-').slice(1).join(' ');
        title = title[0].toLocaleUpperCase() + title.slice(1);
        const examples = findExamples(component, this.docs);
        const tags = component.docsTags
            .filter(negate(isTag('slot')))
            .filter(negate(isTag('exampleComponent')));

        return [
            <h1 id={this.getId()}>{title}</h1>,
            <kompendium-markdown text={component.docs} />,
            <kompendium-taglist tags={tags} />,
            <ExampleList
                examples={examples}
                tags={component.docsTags}
                id={this.getId('examples')}
            />,
            <PropertyList
                props={component.props}
                id={this.getId('properties')}
            />,
            <EventList events={component.events} id={this.getId('events')} />,
            <MethodList
                methods={component.methods}
                id={this.getId('methods')}
            />,
            <SlotList slots={component.slots} id={this.getId('slots')} />,
            <StyleList styles={component.styles} id={this.getId('styles')} />,
        ];
    }

    private getId(name?: string) {
        const route = this.getRoute().split('/').slice(0, 3).join('/');
        return [route, name].filter((item) => !!item).join('/');
    }

    private getRoute() {
        return location.hash.substr(1);
    }
}

function findExamples(component: JsonDocsComponent, docs: JsonDocs) {
    return docs.components.filter(isExampleOf(component));
}

function findComponent(tag: string, docs: JsonDocs) {
    return docs.components.find((doc) => doc.tag === tag);
}

const isExampleOf = (component: JsonDocsComponent) => (
    example: JsonDocsComponent
) => {
    return !!component.docsTags
        .filter(isTag('exampleComponent'))
        .find(isExampleTag(example.tag));
};

const isTag = (name: string) => (tag: JsonDocsTag) => {
    return tag.name === name;
};
