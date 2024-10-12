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
    OptionDefaults,
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

export async function parseFile(filename: string): Promise<TypeDescription[]> {
    if (!existsSync(filename)) {
        // eslint-disable-next-line no-console
        console.warn('typeRoot file does not exist', filename);

        return [];
    }

    const options: Partial<TypeDocOptions> = {
        readme: 'none',
        blockTags: [...OptionDefaults.blockTags, '@sourceFile'],
    };

    if (filename.endsWith('.d.ts')) {
        options.exclude = ['**/+(*test*|node_modules)/**'];
    }

    const app = await Application.bootstrap(options);

    app.options.addReader(new TSConfigReader());
    app.options.addReader(new TypeDocReader());

    app.options.setValue('entryPoints', [filename]);

    const reflection = await app.convert();
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
    logReflection(
        '--- traverseCallback reflection.kind ---',
        ReflectionKind.singularString(reflection.kind),
    );
    logReflection('--- traverseCallback reflection.name ---', reflection.name);
    logReflection('--- traverseCallback reflection ---', reflection);
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
        value:
            reflection.type.type === 'literal'? `"${reflection.type.value.toString()}"`: '',
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
    logReflection(
        `--- getMethod reflection for ${reflection.name} ---`,
        reflection,
    );
    logReflection(
        `--- getMethod reflection.comment for ${reflection.name} ---`,
        reflection.comment,
        6,
    );
    if (reflection.implementationOf?.reflection) {
        const superReflection = reflection.implementationOf?.reflection;
        logReflection(
            `--- getMethod reflection.implementationOf?.reflection for ${reflection.name} ---`,
            reflection.implementationOf?.reflection,
        );
        if ('isDeclaration' in superReflection && superReflection.isDeclaration()) {
            logReflection(
                `--- getMethod superReflection.type for ${reflection.name} ---`,
                superReflection.type,
            )
            if (superReflection.type?.type === 'reflection') {
                logReflection(
                    `--- getMethod superReflection.type.declaration.signatures for ${reflection.name} ---`,
                    superReflection.type.declaration.signatures,
                    6
                );
            }
        }
    }

    if ('declaration' in reflection.type) {
        logReflection('--- getMethod reflection.type.declaration ---', reflection.type.declaration);
    }

    let parameters: ParameterDescription[] = [];
    let returns: JsonDocsMethodReturn = { type: '', docs: '' };
    let signature: SignatureReflection;
    let docs: string;

    if (reflection.type && reflection.type.type === 'reflection') {
        const declaration = (reflection.type as any).declaration;
        if (
            declaration &&
            declaration.signatures &&
            declaration.signatures.length > 0
        ) {
            signature = declaration.signatures[0];
            logReflection(
                '--- getting parameters and returns from declaration.signatures[0] ---',
                signature,
            );
            parameters = getParameters(signature);
            returns = getReturns(reflection, signature);
            docs =
                signature.comment?.summary
                    .map((value: CommentDisplayPart) => value.text?.trim())
                    .join(' ') || '';
        }
    }

    logReflection(
        `--- getMethod signature for ${reflection.name} ---`,
        signature,
    );
    logReflection(
        `--- getMethod signature.comment for ${reflection.name} ---`,
        signature.comment,
        3,
    );
    logReflection('--- getMethod docs ---', docs, 3);

    const result = {
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        parameters: parameters,
        returns: returns,
    };

    logReflection('--- getMethod result ---', result, 3);

    return result;
}

// @ts-ignore
function getParameters(signature: SignatureReflection): ParameterDescription[] {
    logReflection('--- getParameters for signature ---', signature);

    return (
        signature.parameters?.map((param) => {
            logReflection('--- getParameters param ---', param);
            logReflection('--- getParameters param.comment ---', param.comment);
            const paramDoc =
                param.comment?.summary
                    .map((value: CommentDisplayPart) => value.text?.trim())
                    .join(' ') || '';

            return {
                name: param.name,
                type: param.type?.toString() || '',
                docs: paramDoc,
                default: param.defaultValue,
                optional: param.flags.isOptional,
            };
        }) || []
    );
}

// @ts-ignore
function getReturns(reflection: DeclarationReflection, signature: SignatureReflection): JsonDocsMethodReturn {
    const returnDoc =
        signature.comment?.blockTags
            ?.find((tag: CommentTag) => tag.tag === '@returns')
            ?.content.map((value: CommentDisplayPart) => value.text?.trim())
            .join(' ') || '';

    return {
        type: signature.type?.toString() || '',
        docs: returnDoc,
    };
}

function getDocs(reflection: Reflection): string {
    return [
        reflection.comment?.summary
            .map((value: CommentDisplayPart) => value.text?.trim())
            .join(' '),
    ]
        .filter(Boolean)
        .join('\n')
        .trim();
}

function getDocsTags(reflection: Reflection): JsonDocsTag[] {
    logReflection(
        `--- getDocsTags for ${reflection.name} ---`,
        reflection,
    );
    logReflection(
        `--- getDocsTags for ${reflection.name} ---`,
        reflection.comment,
    );

    return (
        reflection.comment?.blockTags
            ?.filter(
                (tag: CommentTag) =>
                    tag.tag !== '@param' && tag.tag !== '@returns',
            )
            .map((tag: CommentTag) => ({
                name: tag.tag.replace(/^@/, '').trim(),
                text:
                    tag.content?.map((val) => val.text?.trim()).join(' ') || '',
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

function logReflection(
    // @ts-ignore
    description: string,
    // @ts-ignore
    reflection: any,
    // @ts-ignore
    depth: number = 3,
) {
    console.log(`\n${description}\n\n`, util.inspect(reflection, { depth: depth, colors: true }));
}
