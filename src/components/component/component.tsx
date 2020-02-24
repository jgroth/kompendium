import { Component, h, Prop } from '@stencil/core';
import { JsonDocs } from '@stencil/core/internal';
import { MatchResults } from '@stencil/router';

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
        return getDocs(this.match.params.name, this.docs);
    }

}

function getDocs(name: string, docs: JsonDocs) {
    const component = docs.components.find(doc => doc.tag === name);
    if (!component || !component.docs) {
        return;
    }

    return <maki-markdown text={component.docs} />
}
