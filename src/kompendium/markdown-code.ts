import map from 'unist-util-map';

export function kompendiumCode(): (tree) => any {
    return transformer;
}

function transformer(tree) {
    console.log('kompendiumCode transformer -> tree', tree);
    return map(tree, mapCodeNode);
}

function mapCodeNode(node) {
    console.log('kompendiumCode mapCodeNode -> node', node);
    if (node.type !== 'element') {
        return node;
    }

    if (node.tagName !== 'code') {
        return node;
    }

    const language = getLanguage(node.properties);
    if (!language) {
        return node;
    }

    const result = {
        ...node,
        type: 'element',
        tagName: 'kompendium-code',
        properties: {
            language: language,
        },
        children: [],
    };
    console.log('kompendiumCode mapCodeNode -> result', result);
    return result;
}

function getLanguage(props: { className?: string[] }) {
    console.log('getLanguage -> props', props);
    if (!props) {
        return;
    }

    if (!('className' in props)) {
        return;
    }

    const languageClass = props.className.find((name) =>
        name.startsWith('language-'),
    );
    if (!languageClass) {
        return;
    }
    console.log('getLanguage -> languageClass', languageClass);
    return languageClass.replace('language-', '');
}
