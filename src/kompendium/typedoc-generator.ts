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
    CommentDisplayPart,
    CommentTag,
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
    logReflection('--- addEnumMember ---', reflection);
    data.push({
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        value: reflection.type.type === 'literal' ? `"${reflection.type.value.toString()}"` : '',
    });
}

function isProperty(reflection: DeclarationReflection): boolean {
    return (
        reflection.kind === ReflectionKind.Property &&
        reflection.type.toString().toLowerCase() !== 'function'
    );
}

function isMethod(reflection: DeclarationReflection): boolean {
    return (
        reflection.kind === ReflectionKind.Property &&
        reflection.type.toString().toLowerCase() === 'function'
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
    logReflection(`--- getMethod for ${reflection.name} ---`, reflection, 3);

    let parameters: ParameterDescription[] = [];
    let returns: JsonDocsMethodReturn = { type: '', docs: '' };

    if (reflection.type && reflection.type.type === 'reflection') {
        const declaration = (reflection.type as any).declaration;
        if (
            declaration &&
            declaration.signatures &&
            declaration.signatures.length > 0
        ) {
            const signature = declaration.signatures[0];
            logReflection('--- getting parameters and returns from declaration.signatures[0] ---', signature);
            parameters = getParameters(signature);
            returns = getReturns(signature);
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
): ParameterDescription[] {
    logReflection('--- getParameters for signature ---', signature);

    return (
        signature.parameters?.map((param) => {
            logReflection('--- getParameters param ---', param);
            logReflection('--- getParameters param.comment ---', param.comment);
            const paramDoc = param.comment?.summary.find((value: CommentDisplayPart) => value.kind === 'text');

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
): JsonDocsMethodReturn {
    logReflection('--- getReturns for signature ---', signature);
    logReflection('--- getReturns for signature.comment ---', signature.comment);

    const returnDoc = signature.comment?.blockTags?.find((tag: CommentTag) => tag.tag === '@returns')?.content.find((value: CommentDisplayPart) => value.kind === 'text');

    return {
        type: signature.type?.toString() || '',
        docs: returnDoc?.text.trim() || '',
    };
}

function getDocs(reflection: Reflection): string {
    logReflection(`--- getDocs for ${reflection.name} ---`, reflection.comment);
    return [reflection.comment?.summary.find((value: CommentDisplayPart) => value.kind === 'text')?.text].filter(Boolean).join('\n').trim();
}

function getDocsTags(reflection: Reflection): JsonDocsTag[] {
    logReflection(`--- getDocsTags for ${reflection.name} ---`, reflection.comment);

    return (
        reflection.comment?.blockTags
            ?.filter(
                (tag: CommentTag) =>
                    tag.tag !== '@param' && tag.tag !== '@returns',
            )
            .map((tag: CommentTag) => ({
                name: tag.tag.replace(/^@/, '').trim(),
                text: tag.content?.find(value => value.kind === 'text')?.text?.trim() || '',
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
function logReflection(description: string, reflection: any, depth: number = 2) {
    console.log(`\n${description}\n\n`, util.inspect(reflection, { depth: depth, colors: true }));
}
