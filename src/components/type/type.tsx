import { Component, h, Prop, State } from '@stencil/core';
import { TypeDescription, TypeDescriptionType } from '../../types';
import { Interface } from './templates/interface';
import { Alias } from './templates/alias';
import { Enum } from './templates/enum';

@Component({
    tag: 'kompendium-type',
    shadow: true,
    styleUrl: '../component/component.scss',
})
export class Type {
    /**
     */
    @Prop()
    public types: TypeDescription[];

    @Prop()
    public name: string;

    @State()
    private type: TypeDescription;

    public componentWillRender(): void {
        this.findType();
    }

    render(): HTMLElement {
        if (!this.type) {
            return;
        }

        const type: any = this.type;
        const componentMap: Record<TypeDescriptionType, any> = {
            interface: Interface,
            alias: Alias,
            enum: Enum,
            class: Interface,
        };
        const TypeComponent = componentMap[this.type.type];

        return (
            <article class="type">
                <section class="docs">
                    <TypeComponent type={type} />
                </section>
            </article>
        );
    }

    private findType() {
        const type = this.types.find((type) => type.name === this.name);

        if (type) {
            this.type = type;
        }
    }
}
