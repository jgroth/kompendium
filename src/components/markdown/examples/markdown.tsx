import { Component, h } from '@stencil/core';

const text: string = `
# Bacon Ipsum!

Spicy jalapeno bacon ipsum dolor amet fatback bresaola enim
duis anim pork loin pork chop exercitation aute consectetur.
Eu pork ground round lorem laboris shoulder et shank pancetta
swine pork belly tongue. Ham hock tenderloin cupidatat short
loin beef brisket id sed. Chicken pariatur strip steak ad,
salami picanha corned beef aliquip capicola. Pork chop corned
beef cupidatat tail id. Ut non drumstick laborum, in turducken
velit strip steak commodo ipsum consequat reprehenderit ball tip
cupim burgdoggen.

## Culpa prosciutto
Jowl short ribs **meatloaf** duis in buffalo ipsum ex ut pork belly
eu. Bresaola nulla porchetta, biltong flank pastrami cow in
eiusmod brisket doner drumstick ex. Ham tri-tip aliquip veniam
shank fatback tongue *turkey* buffalo chicken bresaola kevin
aliqua. Nulla pork chop burgdoggen, deserunt picanha shoulder
reprehenderit consectetur esse in. Reprehenderit boudin labore in.

> Ham hock tenderloin cupidatat short loin beef brisket \`id\` sed

1. Brisket
2. Jalapeno
3. Tenderloin

\`\`\`
if (meat === 'tenderloin') {
    console.log('Meatlover!')
}
\`\`\`
`;

/**
 * This is a simple example of how the `kompendium-markdown` component is used
 *
 * @title Simple usage
 */
@Component({
    tag: 'kompendium-example-markdown',
    shadow: true,
    styleUrl: 'markdown.scss'
})
export class MarkdownExample {

    public render() {
        return <kompendium-markdown text={text} />
    }
}
