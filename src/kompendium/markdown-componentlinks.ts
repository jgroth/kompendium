import flatMap from 'unist-util-flatmap';
import { Node } from 'unist';
import { Transformer } from 'unified';

/**
 * Find references to components inside code blocks and wrap them in links.
 *
 * @param {any} options Options
 * @returns {Transformer} Transformer
 */
export function componentLinks(options: any = {}): Transformer {
    return transformer(options.components);
}

const transformer =
    (components: string[] = []): Transformer =>
    (tree): any => {
        if (components.length === 0) {
            return tree;
        }

        return flatMap(tree, mapCodeNode(components));
    };

const mapCodeNode =
    (components: string[] = []) =>
    (node, _, parent) => {
        if (node.type !== 'element') {
            return [node];
        }

        // only look inside code
        if (node.tagName !== 'code') {
            return [node];
        }

        // don't look inside inline code
        if (parent.parent?.tagName === 'pre') {
            return [node];
        }

        if (node.children.some((child: Node) => child.type !== 'text')) {
            return [node];
        }

        return wrapText(node, components);
    };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function wrapText(node: any, components: string[] = []) {
    const componantsstring = node.children.map((c) => c.value).join('');

    return [
        {
            ...node,
            children: splitComponentstring(componantsstring).map(
                createNode(components)
            ),
        },
    ];
}

const createNode =
    (components: string[] = []) =>
    (component: string) => {
        if (!components.includes(component)) {
            return createTextNode(component);
        }

        return createLinkNode(component);
    };

function createTextNode(text: string) {
    return {
        type: 'text',
        value: text,
    };
}

function createLinkNode(component: string) {
    return {
        type: 'element',
        tagName: 'a',
        properties: {
            href: `#/component/${component}`,
        },
        children: [
            {
                type: 'text',
                value: component,
            },
        ],
    };
}

export function splitComponentstring(componentstring: string): string[] {
    const pattern = /(\b[\w-]+\b)+/g;
    const components = componentstring.match(pattern);
    const result: string[] = [];

    let currentString = componentstring;
    components.forEach((component: string) => {
        const index = currentString.indexOf(component);
        if (index > 0) {
            result.push(currentString.substr(0, index));
        }

        result.push(component);
        currentString = currentString.substr(index + component.length);
    });

    if (currentString.length > 0) {
        result.push(currentString);
    }

    return result;
}
