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
import { compileGetMethodOutput } from "./compileGetMethodOutput";

export function getMethod(reflection: DeclarationReflection): MethodDescription {
    let parameters: ParameterDescription[] = [];
    let returns: JsonDocsMethodReturn = { type: '', docs: '' };
    let docs: string = getDocs(reflection);
    let signatureDocs;
    let inheritedSignatureDocs;

    const inheritedReflection = getInheritedReflection(reflection);

    const signature = getSignatureFromReflection(reflection);
    if (signature) {
        signatureDocs = getFromSignature(signature);
    }

    if (inheritedReflection) {
        if (inheritedReflection.type?.type === 'reflection') {
            const inheritedSignature =
                inheritedReflection.type.declaration.signatures[0];
            inheritedSignatureDocs = getFromSignature(inheritedSignature);
        }
    }

    const all = {
        name: reflection.name,
        docs: docs,
        docsTags: getDocsTags(reflection),
        parameters: parameters,
        returns: returns,
        signatureParameters: signatureDocs?.parameters,
        signatureReturns: signatureDocs?.returns,
        signatureDocs: signatureDocs?.docs,
        inheritedSignatureParameters: inheritedSignatureDocs?.parameters,
        inheritedSignatureReturns: inheritedSignatureDocs?.returns,
        inheritedSignatureDocs: inheritedSignatureDocs?.docs,
    };
    log('getMethod all', all, 6);
    const result = compileGetMethodOutput(all);
    log('getMethod result', result, 6);
    return result;
}

function getSignatureFromReflection(reflection: DeclarationReflection) {
    if (reflection.type?.type === 'reflection') {
        const declaration = (reflection.type as any).declaration;
        if (declaration?.signatures?.length > 0) {
            return declaration.signatures[0];
        }
    }
    return undefined;
}

function getFromSignature(signature: SignatureReflection) {
    return {
        parameters: getParameters(signature),
        returns: getReturns(signature),
        docs: getDocsFromSignature(signature),
    };
}
