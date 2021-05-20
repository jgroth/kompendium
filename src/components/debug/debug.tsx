import { Component, h, Prop } from '@stencil/core';
import {
    JsonDocs,
    JsonDocsComponent,
    JsonDocsTag,
} from '@stencil/core/internal';
import { MatchResults } from '@stencil/router';

@Component({
    tag: 'kompendium-debug',
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
        const props = {
            schema: schema,
        };

        return (
            <div class="show-case">
                <div class="show-case_component">
                    <ExampleComponent {...props} />
                </div>
            </div>
        );
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
