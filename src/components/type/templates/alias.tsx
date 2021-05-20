import { h } from '@stencil/core';
import { AliasDescription } from '../../../types';

export function Alias({ type }: { type: AliasDescription }): HTMLElement[] {
    const alias = '`' + type.alias + '`';

    return [
        <h1 id={type.name}>{type.name}</h1>,
        <kompendium-markdown text={type.docs} />,
        <kompendium-taglist tags={type.docsTags} />,
        <kompendium-markdown text={alias} />,
    ];
}
