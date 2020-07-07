import { Component, h, Prop, getAssetPath } from '@stencil/core';
import { JsonDocsTag } from '@stencil/core/internal';

/**
 * asd
 */
@Component({
    tag: 'kompendium-taglist',
    shadow: true,
    styleUrl: 'taglist.scss',
})
export class Taglist {
    /**
     * List of tags to render
     */
    @Prop()
    public tags: JsonDocsTag[];

    /**
     * Set to `true` if the list should be rendered in compact mode
     */
    @Prop()
    public compact = false;

    render(): HTMLElement[] {
        return this.tags.map(this.renderTag);
    }

    private renderTag(tag: JsonDocsTag) {
        const classList = {
            'tag-list': true,
        };
        const path = getAssetPath(
            '../collection/assets/icons/bookmark-fill.svg'
        );

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
