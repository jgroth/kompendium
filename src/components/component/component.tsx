import { Component, h, Prop, Element } from '@stencil/core';
import {
    JsonDocs,
    JsonDocsComponent,
    JsonDocsTag,
} from '@stencil/core/internal';
import { MatchResults } from '@limetech/stencil-router';
import { PropertyList } from './templates/props';
import { EventList } from './templates/events';
import { MethodList } from './templates/methods';
import { SlotList } from './templates/slots';
import { StyleList } from './templates/style';
import { ExampleList } from './templates/examples';
import negate from 'lodash/negate';
import { PropsFactory } from '../playground/playground.types';
import {
    getAnchorId,
    getRoute,
    scrollToAnchor,
    scrollToElement,
} from '../anchor-scroll';
import {
    SECTION_SLUGS,
    entrySlug,
    firstLine,
    slugify,
    uniqueExampleSlugs,
} from './anchors';
import { slotDisplayName } from './slots';
import { TocEntry } from '../toc/toc.types';
import { getComponentTitle } from '../component-title';

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
     * Component schemas
     */
    @Prop()
    public schemas: Array<Record<string, any>>;

    /**
     * Matched route parameters
     */
    @Prop()
    public match: MatchResults;

    /**
     * Factory for creating props for example components
     */
    @Prop()
    public examplePropsFactory: PropsFactory;

    @Element()
    private host: HTMLKompendiumComponentElement;

    private scrollToOnNextUpdate: string = null;

    constructor() {
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    protected connectedCallback(): void {
        window.addEventListener('hashchange', this.handleRouteChange);
    }

    protected disconnectedCallback(): void {
        window.removeEventListener('hashchange', this.handleRouteChange);
    }

    protected componentDidLoad(): void {
        scrollToAnchor(this.host.shadowRoot);
    }

    protected componentDidUpdate(): void {
        if (this.scrollToOnNextUpdate) {
            scrollToElement(this.host.shadowRoot, this.scrollToOnNextUpdate);
            this.scrollToOnNextUpdate = null;
        }
    }

    private handleRouteChange() {
        this.scrollToOnNextUpdate = this.getScrollTargetId();
        scrollToAnchor(this.host.shadowRoot);
    }

    private getScrollTargetId(): string | null {
        return getAnchorId() || getRoute().split('#')[0] || null;
    }

    public render(): HTMLElement {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);
        const examples = findExamples(component, this.docs).filter(
            (example): example is JsonDocsComponent => Boolean(example),
        );
        const exampleSlugs = uniqueExampleSlugs(examples);

        return (
            <article class="component">
                <section class="docs">
                    {this.renderDocs(tag, component, examples, exampleSlugs)}
                </section>
                <kompendium-toc
                    entries={buildTocEntries(component, examples, exampleSlugs)}
                />
            </article>
        );
    }

    private renderDocs(
        tag: string,
        component: JsonDocsComponent,
        examples: JsonDocsComponent[],
        exampleSlugs: string[],
    ) {
        const title = getComponentTitle(tag);
        const tags = component.docsTags
            .filter(negate(isTag('slot')))
            .filter(negate(isTag('exampleComponent')));
        const schema = this.schemas.find((s) => s.$id === tag);

        // Each section carries two ids by design: a legacy route-based id on
        // the heading (e.g. `component/<tag>/examples/`, kept so existing
        // sidebar links and `scrollToElement` keep working) and a short,
        // URL-fragment-safe `slugId` on a sibling section-anchor span (the
        // target for the in-page TOC and ¶ anchors). The route-based id cannot
        // double as a hash fragment, hence both coexist.
        return [
            <h1 id={this.getId()}>{title}</h1>,
            <kompendium-markdown text={component.docs} />,
            <kompendium-taglist tags={tags} />,
            <ExampleList
                examples={examples}
                slugs={exampleSlugs}
                id={this.getId('examples')}
                slugId={SECTION_SLUGS.examples}
                schema={schema}
                propsFactory={this.examplePropsFactory}
            />,
            <PropertyList
                props={component.props}
                id={this.getId('properties')}
                slugId={SECTION_SLUGS.properties}
            />,
            <EventList
                events={component.events}
                id={this.getId('events')}
                slugId={SECTION_SLUGS.events}
            />,
            <MethodList
                methods={component.methods}
                id={this.getId('methods')}
                slugId={SECTION_SLUGS.methods}
            />,
            <SlotList
                slots={component.slots}
                id={this.getId('slots')}
                slugId={SECTION_SLUGS.slots}
            />,
            <StyleList
                styles={component.styles}
                id={this.getId('styles')}
                slugId={SECTION_SLUGS.styles}
            />,
        ];
    }

    private getId(name?: string) {
        const route = getRoute().split('#')[0].split('/').slice(0, 3).join('/');

        return [route, name].filter((item) => !!item).join('/') + '/';
    }
}

function findExamples(component: JsonDocsComponent, docs: JsonDocs) {
    return component.docsTags
        .filter(isTag('exampleComponent'))
        .map(findComponentByTag(docs));
}

function findComponent(tag: string, docs: JsonDocs) {
    return docs.components.find((doc) => doc.tag === tag);
}

const findComponentByTag = (docs: JsonDocs) => (tag: JsonDocsTag) => {
    return docs.components.find((component) => component.tag === tag.text);
};

const isTag = (name: string) => (tag: JsonDocsTag) => {
    return tag.name === name;
};

function buildTocEntries(
    component: JsonDocsComponent,
    examples: JsonDocsComponent[],
    exampleSlugs: string[],
): TocEntry[] {
    const entries: TocEntry[] = [];

    if (examples.length) {
        entries.push({
            id: SECTION_SLUGS.examples,
            title: 'Examples',
            collapsible: true,
            defaultExpanded: true,
            children: examples.map((example, index) => {
                const id = exampleSlugs[index];
                const title =
                    exampleTitle(example) || prettifyTag(slugify(example.tag));

                return { id: id, title: title };
            }),
        });
    }

    if (component.props?.length) {
        entries.push(
            collapsibleSection(
                SECTION_SLUGS.properties,
                'Properties',
                component.props.map((prop) => prop.name),
            ),
        );
    }

    if (component.events?.length) {
        entries.push(
            collapsibleSection(
                SECTION_SLUGS.events,
                'Events',
                component.events.map((event) => event.event),
            ),
        );
    }

    if (component.methods?.length) {
        entries.push(
            collapsibleSection(
                SECTION_SLUGS.methods,
                'Methods',
                component.methods.map((method) => method.name),
            ),
        );
    }

    if (component.slots?.length) {
        entries.push(
            collapsibleSection(
                SECTION_SLUGS.slots,
                'Slots',
                component.slots.map((slot) => slotDisplayName(slot.name)),
            ),
        );
    }

    if (component.styles?.length) {
        entries.push(
            collapsibleSection(
                SECTION_SLUGS.styles,
                'Styles',
                component.styles.map((style) => style.name),
            ),
        );
    }

    return entries;
}

function collapsibleSection(
    sectionSlug: string,
    title: string,
    names: string[],
): TocEntry {
    return {
        id: sectionSlug,
        title: title,
        collapsible: true,
        children: names.map((name) => ({
            id: entrySlug(sectionSlug, name),
            title: name,
        })),
    };
}

function exampleTitle(example: JsonDocsComponent): string {
    return firstLine(example.docs);
}

function prettifyTag(slug: string): string {
    if (!slug) {
        return slug;
    }

    const words = slug.split('-').filter(Boolean);
    if (!words.length) {
        return slug;
    }

    return (
        words[0][0].toLocaleUpperCase() +
        words[0].substring(1) +
        (words.length > 1 ? ' ' + words.slice(1).join(' ') : '')
    );
}
