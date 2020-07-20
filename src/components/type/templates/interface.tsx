import { h } from '@stencil/core';
import { InterfaceDescription } from '../../../types';
import { PropertyList } from '../../component/templates/props';
import { MethodList } from '../../component/templates/methods';

export function Interface({
    type,
}: {
    type: InterfaceDescription;
}): HTMLElement[] {
    return [
        <h1 id={type.name}>{type.name}</h1>,
        <kompendium-markdown text={type.docs} />,
        <kompendium-taglist tags={type.docsTags} />,
        <PropertyList props={type.props} />,
        <MethodList methods={type.methods} />,
    ];
}
