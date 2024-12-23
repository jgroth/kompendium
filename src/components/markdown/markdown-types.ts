let types: string[] = [];

export function getTypes(): string[] {
    console.log('getTypes -> types', types);
    return types;
}

export function setTypes(newTypes: string[]): void {
    console.log('setTypes -> newTypes', newTypes);
    types = newTypes;
}
