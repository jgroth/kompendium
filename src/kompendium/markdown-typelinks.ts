import flatMap from 'unist-util-flatmap';

export function typeLinks(options: any = {}): (tree) => any {
    return transformer(options.types);
}

const transformer =
    (types: string[] = []) =>
    (tree): any => {
        console.log('typeLinks transformer -> types', types,);
        console.log('typeLinks transformer -> tree', tree);
        if (types.length === 0) {
            return tree;
        }

        return flatMap(tree, mapCodeNode(types));
    };

const mapCodeNode =
    (types: string[] = []) =>
    (node, _, parent) => {
        console.log('typeLinks mapCodeNode -> node', node);
        console.log('typeLinks mapCodeNode -> parent', parent);
        if (node.type !== 'text') {
            return [node];
        }

        if (parent.tagName !== 'code') {
            return [node];
        }

        if (parent.parent?.tagName === 'pre') {
            return [node];
        }

        return wrapText(node, types);
    };

export function wrapText(node: any, types: string[] = []) {
    console.log('wrapText -> node', node);
    console.log('wrapText -> types', types);
    return splitTypeString(node.value).map(createNode(types));
}

const createNode =
    (types: string[] = []) =>
    (type: string) => {
        if (!types.includes(type)) {
            return createTextNode(type);
        }

        return createLinkNode(type);
    };

function createTextNode(text: string) {
    const result = {
        type: 'text',
        value: text,
    };
    console.log('createTextNode -> result', result);
    return result;
}

function createLinkNode(type: string) {
    const result = {
        type: 'element',
        tagName: 'a',
        properties: {
            href: `#/type/${type}`,
        },
        children: [
            {
                type: 'text',
                value: type,
            },
        ],
    };
    console.log('createLinkNode -> result', result);
    return result;
}

export function splitTypeString(typeString: string): string[] {
    console.log('splitTypeString -> typeString', typeString);
    const pattern = /(\b\w+\b)+/g;
    const types = typeString.match(pattern);
    const result: string[] = [];

    let currentString = typeString;
    types.forEach((type: string) => {
        const index = currentString.indexOf(type);
        if (index > 0) {
            result.push(currentString.substr(0, index));
        }

        result.push(type);
        currentString = currentString.substr(index + type.length);
    });

    if (currentString.length > 0) {
        result.push(currentString);
    }
    console.log('splitTypeString -> result', result);
    return result;
}
