import { Component, h, Prop } from '@stencil/core';
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

        classList[`tag--${tag.name}`] = true;

        return (
            <div class={classList}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z"
                        fill="currentColor"
                    ></path>
                </svg>
                <code>@{tag.name}</code>
                <kompendium-markdown text={tag.text} />
            </div>
        );
    }
}
