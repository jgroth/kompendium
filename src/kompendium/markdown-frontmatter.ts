import visit from 'unist-util-visit';

export function saveFrontmatter(): (tree, file) => any {
    return transformer;
}

function transformer(tree, file) {
    console.log('saveFrontmatter transformer -> tree', tree);
    console.log('saveFrontmatter transformer -> file', file);
    return visit(tree, 'yaml', storeData(file));
}

const storeData = (file) => (item) => {
    console.log('saveFrontmatter storeData -> item', item);
    console.log('saveFrontmatter storeData -> item.data.parsedValue', item.data.parsedValue);
    file.data.frontmatter = item.data.parsedValue;
};
