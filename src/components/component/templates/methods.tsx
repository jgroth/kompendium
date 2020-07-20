import {
    JsonDocsMethod,
    JsonDocMethodParameter,
    JsonDocsMethodReturn,
} from '@stencil/core/internal';
import { h } from '@stencil/core';
import { ProplistItem } from '../../proplist/proplist';
import { ParameterDescription } from '../../../types';

export function MethodList({
    methods,
    id,
}: {
    id?: string;
    methods: Partial<JsonDocsMethod>[];
}): HTMLElement[] {
    if (!methods.length) {
        return;
    }

    return [<h3 id={id}>Methods</h3>, ...methods.map(renderMethod)];
}

function renderMethod(method: JsonDocsMethod) {
    const items: ProplistItem[] = [
        {
            key: 'Signature',
            value: method.signature,
        },
    ].filter((item) => item.value !== undefined);

    return (
        <div>
            <h4>{method.name}</h4>
            <kompendium-markdown text={method.docs} />
            <kompendium-taglist tags={method.docsTags} />
            <kompendium-proplist items={items} />
            <ParamList params={method.parameters} />
            <Returns value={method.returns} />
        </div>
    );
}

function ParamList({ params }: { params: JsonDocMethodParameter[] }) {
    if (!params.length) {
        return;
    }

    return [<h5>Parameters</h5>, ...params.map(renderParam)];
}

function renderParam(param: ParameterDescription) {
    const items: ProplistItem[] = [
        {
            key: 'Type',
            value: param.type,
        },
        {
            key: 'Optional',
            value: String(param.optional),
        },
        {
            key: 'Default',
            value: param.default,
        },
    ].filter((item) => item.value !== undefined);

    return (
        <div>
            <h6>{param.name}</h6>
            <kompendium-markdown text={param.docs} />
            <kompendium-proplist items={items} />
        </div>
    );
}

function Returns({ value }: { value: JsonDocsMethodReturn }) {
    if (!value) {
        return;
    }

    const type = '`' + value.type + '`';
    return [
        <h5>Returns</h5>,
        <kompendium-markdown text={value.docs} />,
        <kompendium-markdown text={type} />,
    ];
}
