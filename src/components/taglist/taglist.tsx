import { Component, h, Prop, getAssetPath } from '@stencil/core';
import { JsonDocsTag } from '@stencil/core/internal';

/**
 * asd
 */
@Component({
    tag: 'kompendium-taglist',
    shadow: true,
    styleUrl: 'taglist.scss'
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
        const classList = {
            'tag-list': true
        };
        const path = getAssetPath('../collection/assets/icons/bookmark-fill.svg');

        classList[`tag--${tag.name}`] = true;

        return (
            <div class={classList}>
                <img src={path} />
                <code>@{tag.name}</code>
                <kompendium-markdown text={tag.text} />
            </div>
        );
    }
}
