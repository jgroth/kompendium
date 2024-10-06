import * as path from 'path';
import {
    Application,
    DeclarationReflection,
    ReflectionKind,
    SignatureReflection,
    Reflection,
    TSConfigReader,
    TypeDocReader,
    TypeDocOptions,
} from 'typedoc';
import {
    JsonDocsTag,
    JsonDocsProp,
    JsonDocsMethodReturn,
} from '@stencil/core/internal';
import {
    InterfaceDescription,
    AliasDescription,
    EnumDescription,
    EnumMember,
    TypeDescription,
    MethodDescription,
    ParameterDescription,
    ClassDescription,
} from '../types';
import { existsSync } from 'fs';
// @ts-ignore
import * as util from 'util';

export function parseFile(filename: string): TypeDescription[] {
    if (!existsSync(filename)) {
        // eslint-disable-next-line no-console
        console.warn('typeRoot file does not exist', filename);

        return [];
    }

    const app = new Application();

    app.options.addReader(new TSConfigReader());
    app.options.addReader(new TypeDocReader());

    const options: Partial<TypeDocOptions> = {
        readme: 'none',
    };

    if (filename.endsWith('.d.ts')) {
        options.exclude = ['**/+(*test*|node_modules)/**'];
    }

    app.bootstrap(options);

    app.options.setValue('entryPoints', [filename]);

    const reflection = app.convert();
    if (!reflection) {
        // eslint-disable-next-line no-console
        console.warn('Could not find any type information');

        return [];
    }

    const data: TypeDescription[] = [];
    reflection.traverse(traverseCallback(data));

    return data;
}

const fns = {
    [ReflectionKind.Interface]: addInterface,
    [ReflectionKind.Class]: addClass,
    [ReflectionKind.TypeAlias]: addType,
    // [ReflectionKind.TypeLiteral]: addType,
    [ReflectionKind.Enum]: addEnum,
    [ReflectionKind.EnumMember]: addEnumMember,
};

const traverseCallback = (data: any) => (reflection: Reflection) => {
    const fn = fns[reflection.kind];
    if (fn) {
        fn(reflection, data);
    } else {
        reflection.traverse(traverseCallback(data));
    }
};

function addInterface(
    reflection: DeclarationReflection,
    data: InterfaceDescription[],
) {
    data.push({
        type: 'interface',
        name: reflection.name,
        typeParams: getTypeParams(reflection),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        props: reflection.children.filter(isProperty).map(getProperty),
        methods: reflection.children.filter(isMethod).map(getMethod),
        sources: getSources(reflection),
    });
}

function addClass(reflection: DeclarationReflection, data: ClassDescription[]) {
    data.push({
        type: 'class',
        name: reflection.name,
        typeParams: getTypeParams(reflection),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        props: reflection.children?.filter(isProperty).map(getProperty),
        methods: reflection.children?.filter(isMethod).map(getMethod),
        sources: getSources(reflection),
    });
}

function addType(reflection: DeclarationReflection, data: AliasDescription[]) {
    data.push({
        type: 'alias',
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        alias: reflection.type.toString(),
        sources: getSources(reflection),
    });
}

function addEnum(reflection: DeclarationReflection, data: EnumDescription[]) {
    const members = [];
    reflection.traverse(traverseCallback(members));

    data.push({
        type: 'enum',
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        members: members,
        sources: getSources(reflection),
    });
}

function addEnumMember(reflection: DeclarationReflection, data: EnumMember[]) {
    data.push({
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        value: reflection.defaultValue,
    });
}

function isProperty(reflection: DeclarationReflection): boolean {
    return (
        reflection.kind === ReflectionKind.Property &&
        reflection.type.toString() !== 'function'
    );
}

function isMethod(reflection: DeclarationReflection): boolean {
    return (
        reflection.kind === ReflectionKind.Property &&
        reflection.type.toString() === 'function'
    );
}

function getProperty(reflection: DeclarationReflection): Partial<JsonDocsProp> {
    return {
        name: reflection.name,
        type: reflection.type.toString(),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        default: reflection.defaultValue,
        optional: reflection.flags.isOptional,
    };
}

function getMethod(reflection: DeclarationReflection): MethodDescription {
    console.log(`\n--- getMethod for ${reflection.name} ---`);
    logReflection(reflection, 3);

    let parameters: ParameterDescription[] = [];
    let returns: JsonDocsMethodReturn = { type: '', docs: '' };

    if (reflection.type && reflection.type.type === 'reflection') {
        console.log('\n--- is reflection ---');
        const declaration = (reflection.type as any).declaration;
        if (
            declaration &&
            declaration.signatures &&
            declaration.signatures.length > 0
        ) {
            console.log(
                '\n--- getting parameters and returns from declaration.signatures[0] ---',
            );
            const signature = declaration.signatures[0];
            logReflection(signature);
            parameters = getParameters(signature, reflection.comment);
            returns = getReturns(signature, reflection.comment);
        }
    }

    const result = {
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        parameters: parameters,
        returns: returns,
    };
    console.log('getMethod returns', JSON.stringify(result, null, 2));

    return result;
}

// @ts-ignore
function getParameters(
    signature: SignatureReflection,
    comment: any,
): ParameterDescription[] {
    console.log('\n--- getParameters for signature ---');
    logReflection(signature);

    return (
        signature.parameters?.map((param) => {
            const paramDoc = comment?.tags?.find(
                (tag: any) =>
                    tag.tagName === 'param' && tag.paramName === param.name,
            );

            return {
                name: param.name,
                type: param.type?.toString() || '',
                docs: paramDoc?.text.trim() || '',
                default: param.defaultValue,
                optional: param.flags.isOptional,
            };
        }) || []
    );
}

// @ts-ignore
function getReturns(
    signature: SignatureReflection,
    comment: any,
): JsonDocsMethodReturn {
    console.log('\n--- getReturns for signature ---');
    logReflection(signature);

    const returnDoc = comment?.tags?.find(
        (tag: any) => tag.tagName === 'returns',
    );

    return {
        type: signature.type?.toString() || '',
        docs: returnDoc?.text.trim() || '',
    };
}

function getDocs(reflection: Reflection): string {
    return [reflection.comment?.summary].filter(Boolean).join('\n').trim();
}

function getDocsTags(reflection: Reflection): JsonDocsTag[] {
    console.log(`\n--- getDocsTags for ${reflection.name} ---`);
    logReflection(reflection.comment);

    return (
        reflection.comment?.blockTags
            ?.filter(
                (tag: any) =>
                    tag.tagName !== 'param' && tag.tagName !== 'returns',
            )
            .map((tag: any) => ({
                name: tag.tagName,
                text: tag.text?.trim() || '',
            })) || []
    );
}

function getTypeParams(reflection: DeclarationReflection) {
    return (
        reflection.typeParameters?.map((param) => ({
            name: param.name,
        })) || []
    );
}

function getSources(reflection: DeclarationReflection) {
    return (
        reflection.sources?.map((source) =>
            path.relative(process.cwd(), source.fullFileName),
        ) || []
    );
}

// @ts-ignore
function logReflection(reflection: any, depth: number = 2) {
    console.log(util.inspect(reflection, { depth: depth, colors: true }));
}
