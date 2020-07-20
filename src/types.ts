import {
    JsonDocs,
    JsonDocsTag,
    JsonDocsProp,
    JsonDocsMethod,
    JsonDocMethodParameter,
} from '@stencil/core/internal';

export interface KompendiumConfig {
    /**
     * Output path
     */
    path: string;

    /**
     * www
     */
    publicPath: string;

    title?: string;

    typeRoot: string;
}

export interface MenuItem {
    title?: string;
    path: string;
    icon?: string;
    children?: MenuItem[];
}

export interface KompendiumData {
    title: string;
    docs: JsonDocs;
    menu: MenuItem[];
    readme?: string;
    guides: KompendiumGuide[];
    types: TypeDescription[];
}

export interface KompendiumGuide {
    dirPath?: string;
    fileName?: string;
    filePath?: string;
    data: Record<string, any>;
    content: string;
}

export type TypeDescriptionType = 'interface' | 'alias' | 'enum';

export interface TypeDescription {
    type: TypeDescriptionType;
    name: string;
    docs: string;
    docsTags: JsonDocsTag[];
}

export interface InterfaceDescription extends TypeDescription {
    type: 'interface';
    typeParams: TypeParam[];
    props: Partial<JsonDocsProp>[];
    methods: MethodDescription[];
}

export interface TypeParam {
    name: string;
}

export interface AliasDescription extends TypeDescription {
    type: 'alias';
    alias: string;
}

export interface EnumDescription extends TypeDescription {
    type: 'enum';
    members: EnumMember[];
}

export interface EnumMember {
    name: string;
    docs: string;
    docsTags: JsonDocsTag[];
    value: string;
}

export interface MethodDescription extends Partial<JsonDocsMethod> {
    parameters: ParameterDescription[];
}

export interface ParameterDescription extends JsonDocMethodParameter {
    default: string;
    optional: boolean;
}
