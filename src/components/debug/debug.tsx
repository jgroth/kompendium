import { Component, h, Prop } from '@stencil/core';
import { JsonDocs, JsonDocsComponent } from '@stencil/core/internal';
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

        return (
            <div class="show-case">
                <div class="show-case_component">
                    <ExampleComponent />
                </div>
            </div>
        );
    }
}

function findComponent(tag: string, docs: JsonDocs) {
    return docs.components.find((doc) => doc.tag === tag);
}
