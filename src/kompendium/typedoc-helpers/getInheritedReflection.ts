import { DeclarationReflection } from "typedoc";
// import { log } from "./logger";

export function getInheritedReflection(
    reflection: DeclarationReflection
): DeclarationReflection | undefined {
    // log('getInheritedReflection reflection.implementationOf', reflection.implementationOf);
    // log('getInheritedReflection reflection.inheritedFrom', reflection.inheritedFrom);
    if (reflection.implementationOf?.reflection) {
        // @ts-ignore
        return reflection.implementationOf.reflection;
    }

    if (reflection.inheritedFrom?.reflection) {
        // @ts-ignore
        return reflection.inheritedFrom.reflection;
    }

    return undefined;
}
