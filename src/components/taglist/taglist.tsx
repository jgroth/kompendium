import { Component, h, Prop } from '@stencil/core';
import { JsonDocsTag } from '@stencil/core/internal';

/**
 * asd
 */
@Component({
    tag: 'maki-taglist',
    shadow: true
})
export class Taglist {

    @Prop()
    public tags: JsonDocsTag[];

    @Prop()
    public compact: boolean = false;

    render() {
        return this.tags.map(this.renderTag);
    }

    private renderTag(tag: JsonDocsTag) {
        return (
            <div>
                <code>@{tag.name}</code><maki-markdown text={tag.text} />
            </div>
        );
    }
}
