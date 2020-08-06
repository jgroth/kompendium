import { Component, h, Prop } from '@stencil/core';

export interface ProplistItem {
    key: string;
    value: string;
}

@Component({
    tag: 'kompendium-proplist',
    shadow: true,
    styleUrl: 'proplist.scss',
})
export class Proplist {
    /**
     * List of properties
     */
    @Prop()
    public items: ProplistItem[];

    render(): HTMLElement {
        return <dl>{this.items.map(this.renderProperty)}</dl>;
    }

    private renderProperty(property: ProplistItem) {
        const { key, value } = property;

        return [
            <dt>{key}</dt>,
            <dd class={`value--${value}`}>
                <kompendium-markdown text={`\`${value}\``} />
            </dd>,
        ];
    }
}
