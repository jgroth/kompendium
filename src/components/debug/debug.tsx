import { Component, h, Prop } from '@stencil/core';
import {
    JsonDocs,
    JsonDocsComponent,
    JsonDocsTag,
} from '@stencil/core/internal';
import { MatchResults } from '@limetech/stencil-router';
import { PropsFactory } from '../playground/playground.types';
import { getComponentTitle } from '../component-title';

@Component({
    tag: 'kompendium-debug',
    styleUrl: 'debug.scss',
    shadow: true,
})
export class KompendiumDebug {
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
     * @returns {Record<string, unknown>} props
     */
    @Prop()
    public examplePropsFactory?: PropsFactory = () => ({});

    public render(): HTMLElement {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);

        return (
            <article class="component">
                <section class="docs debug">
                    {this.renderComponent(component)}
                </section>
            </article>
        );
    }

    private renderComponent(component: JsonDocsComponent) {
        const ExampleComponent = component.tag;
        const ownerComponent = this.docs.components.find(isOwnerOf(component));
        const schema = this.schemas.find((s) => s.$id === ownerComponent.tag);
        const factory = this.examplePropsFactory;
        const props = {
            schema: schema,
            ...factory(ExampleComponent),
        };

        return [
            this.renderHeadings(component, ownerComponent),
            <div class="show-case">
                <div class="show-case_component">
                    <ExampleComponent {...props} />
                </div>
            </div>,
        ];
    }

    /*
     * Render the same heading context as the component page, so that the
     * heading outline of an example is identical on both pages, e.g. when
     * testing for accessibility
     */
    private renderHeadings(
        component: JsonDocsComponent,
        ownerComponent: JsonDocsComponent,
    ) {
        const exampleTitle = component.docs?.split('\n')[0];

        return [
            <h2 class="context-heading">
                {getComponentTitle(ownerComponent.tag)}
            </h2>,
            !!exampleTitle && <h3 class="context-heading">{exampleTitle}</h3>,
        ];
    }
}

function findComponent(tag: string, docs: JsonDocs) {
    return docs.components.find((doc) => doc.tag === tag);
}

const isOwnerOf =
    (example: JsonDocsComponent) => (component: JsonDocsComponent) => {
        return !!component.docsTags
            .filter(isTag('exampleComponent'))
            .find(hasText(example.tag));
    };

const isTag = (name: string) => (tag: JsonDocsTag) => {
    return tag.name === name;
};

const hasText = (name: string) => (tag: JsonDocsTag) => {
    return tag.text === name;
};
