import {
    JsonDocsMethod,
    JsonDocMethodParameter,
    JsonDocsMethodReturn,
} from '@stencil/core/internal';
import { h } from '@stencil/core';
import { ProplistItem } from '../../proplist/proplist';
import { ParameterDescription } from '../../../types';
import { entrySlug } from '../anchors';

export function MethodList({
    methods,
    id,
    slugId,
}: {
    id?: string;
    slugId?: string;
    methods: Array<Partial<JsonDocsMethod>>;
}): HTMLElement[] {
    if (!methods.length) {
        return;
    }

    return [
        slugId ? (
            <span class="section-anchor" id={slugId} aria-hidden="true"></span>
        ) : null,
        <h3 class="docs-layout-section-heading" id={id}>
            Methods
            {slugId ? (
                <kompendium-anchor slug={slugId} label="Methods" />
            ) : null}
        </h3>,
        ...methods.map(renderMethod(slugId)),
    ];
}

const renderMethod =
    (sectionSlug: string | undefined) => (method: JsonDocsMethod) => {
        const items: ProplistItem[] = [
            {
                key: 'Signature',
                value: method.signature,
            },
        ].filter((item) => item.value !== undefined);
        const slug = sectionSlug ? entrySlug(sectionSlug, method.name) : null;

        return (
            <div class="methods-layout">
                <h4 class="methods-title" id={slug}>
                    {method.name}
                    {slug ? (
                        <kompendium-anchor slug={slug} label={method.name} />
                    ) : null}
                </h4>
                <div class="methods-content">
                    <div>
                        <kompendium-markdown text={method.docs} />
                    </div>
                    <div>
                        <kompendium-taglist tags={method.docsTags} />
                        <kompendium-proplist items={items} />
                        <ParamList params={method.parameters} />
                    </div>
                </div>
                <div class="methods-returns">
                    <Returns value={method.returns} />
                </div>
            </div>
        );
    };

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
