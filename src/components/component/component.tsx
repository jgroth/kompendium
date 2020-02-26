import { Component, h, Prop } from '@stencil/core';
import { JsonDocs } from '@stencil/core/internal';
import { MatchResults } from '@stencil/router';
import { PropertyList } from './templates/props';
import { EventList } from './templates/events';
import { MethodList } from './templates/methods';
import { SlotList } from './templates/slots';
import { StyleList } from './templates/style';

@Component({
    tag: 'maki-component',
    shadow: true
})
export class MakiComponent {

    @Prop()
    public docs: JsonDocs;

    @Prop()
    public match: MatchResults;

    public render() {
        const tag = this.match.params.name;
        const component = findComponent(tag, this.docs);

        let title = tag.split('-').slice(1).join(' ');
        title = title[0].toLocaleUpperCase() + title.slice(1);

        return [
            <h1>{title}</h1>,
            <maki-taglist tags={component.docsTags.filter(tag => tag.name !== 'slot')} />,
            <maki-markdown text={component.docs}/>,
            <PropertyList props={component.props}/>,
            <EventList events={component.events}/>,
            <MethodList methods={component.methods}/>,
            <SlotList slots={component.slots}/>,
            <StyleList slots={component.styles}/>
        ];
    }
}

function findComponent(tag: string, docs: JsonDocs) {
    return docs.components.find(doc => doc.tag === tag);
}
