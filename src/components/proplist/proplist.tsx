import { Component, h, Prop } from '@stencil/core';

export interface ProplistItem {
    key: string;
    value: string;
}

@Component({
    tag: 'maki-proplist',
    shadow: true
})
export class Proplist {

    @Prop()
    public items: ProplistItem[];

    render() {
        return (
            <dl>
                {this.items.map(this.renderProperty)}
            </dl>
        );
    }

    private renderProperty(property: ProplistItem) {
        return [
            <dt>{property.key}</dt>,
            <dd>{property.value}</dd>
        ];
    }
}



