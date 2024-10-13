import { JsonDocsMethodReturn } from "@stencil/core/internal";
import { DeclarationReflection, SignatureReflection } from "typedoc";
import { MethodDescription, ParameterDescription } from "../../types";
import { getDocs } from "./getDocs";
import { getDocsFromSignature } from "./getDocsFromSignature";
import { getDocsTags } from "./getDocsTags";
import { getInheritedReflection } from "./getInheritedReflection";
import { getParameters } from "./getParameters";
import { getReturns } from "./getReturns";
import { log } from "./logger";

export function getMethod(reflection: DeclarationReflection): MethodDescription {
    log(`--- getMethod reflection for ${reflection.name} ---`, reflection);
    let parameters: ParameterDescription[] = [];
    let returns: JsonDocsMethodReturn = { type: '', docs: '' };
    let signature: SignatureReflection;
    let docs: string = getDocs(reflection); // Direct docs from reflection

    // Check if the method is inheriting documentation
    const inheritedReflection = getInheritedReflection(reflection);

    if (reflection.type && reflection.type.type === 'reflection') {
        const declaration = (reflection.type as any).declaration;
        if (
            declaration &&
            declaration.signatures &&
            declaration.signatures.length > 0
        ) {
            signature = declaration.signatures[0];
            log('--- getting parameters and returns from declaration.signatures[0] ---', signature);
            parameters = getParameters(signature);
            returns = getReturns(signature);
            docs = getDocsFromSignature(signature); // Try to extract docs from signature
        }
    }

    // Fallback to inherited documentation if no docs are found on the current reflection
    if (!docs && inheritedReflection) {
        log(`--- Using inherited documentation for ${reflection.name} ---`, inheritedReflection);
        const inheritedSignature =
            // @ts-ignore
            inheritedReflection.type.declaration.signatures[0];
        parameters = getParameters(inheritedSignature);
        returns = getReturns(inheritedSignature);
        docs = getDocsFromSignature(inheritedSignature); // Get docs from inherited signature
    }

    const result = {
        name: reflection.name,
        docs: docs, // Using the fallback docs if needed
        docsTags: getDocsTags(reflection),
        parameters: parameters,
        returns: returns,
    };
    log('--- getMethod result ---', result, 3);
    return result;
}
