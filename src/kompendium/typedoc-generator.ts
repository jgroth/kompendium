import {
    Application,
    DeclarationReflection,
    ReflectionKind,
    Reflection,
    TSConfigReader,
    TypeDocReader,
    TypeDocOptions,
    OptionDefaults,
} from 'typedoc';
import { JsonDocsProp } from '@stencil/core/internal';
import {
    InterfaceDescription,
    AliasDescription,
    EnumDescription,
    EnumMember,
    TypeDescription,
    ClassDescription,
} from '../types';
import { existsSync } from 'fs';
import { getDocs } from './typedoc-helpers/getDocs';
import { getDocsTags } from './typedoc-helpers/getDocsTags';
import { getSources } from './typedoc-helpers/getSources';
import { getTypeParams } from './typedoc-helpers/getTypeParams';
import { getMethod } from './typedoc-helpers/getMethod';

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
    // log(
    //     '--- traverseCallback reflection.kind ---',
    //     ReflectionKind.singularString(reflection.kind),
    // );
    // log('--- traverseCallback reflection.name ---', reflection.name);
    // log('--- traverseCallback reflection ---', reflection);
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
    // log('--- addEnumMember ---', reflection);
    let value = '';
    if (reflection.type.type === 'literal') {
        value = `"${reflection.type.value.toString()}"`;
    }

    data.push({
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        value: value,
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


