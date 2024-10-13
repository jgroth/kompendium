import { JsonDocsMethodReturn, JsonDocsTag } from "@stencil/core/internal";
import { ParameterDescription } from "../../types";
import { log } from "./logger";

function mergeParameters(primary: ParameterDescription[], fallback: ParameterDescription[]): ParameterDescription[] {
    const fallbackMap = new Map(fallback.map(p => [p.name, p]));

    return primary.map(p => {
        const fallbackParam = fallbackMap.get(p.name);
        return {
            ...fallbackParam,
            ...p,
            docs: p.docs || fallbackParam?.docs || "",  // Prioritize non-empty docs from primary
        };
    }).concat(fallback.filter(f => !primary.find(p => p.name === f.name)));
}

function mergeReturns(primary?: JsonDocsMethodReturn, fallback?: JsonDocsMethodReturn): JsonDocsMethodReturn {
    if (!primary && !fallback) return { type: '', docs: '' };

    return {
        type: primary?.type || fallback?.type || '',
        docs: primary?.docs || fallback?.docs || '',  // Prioritize non-empty docs from primary
    };
}

export function compileGetMethodOutput(all: {
    name: string;
    docs: string;
    docsTags: JsonDocsTag[];
    parameters: ParameterDescription[];
    returns: JsonDocsMethodReturn;
    signatureParameters?: ParameterDescription[];
    signatureReturns?: JsonDocsMethodReturn;
    signatureDocs?: string;
    inheritedSignatureParameters?: ParameterDescription[];
    inheritedSignatureReturns?: JsonDocsMethodReturn;
    inheritedSignatureDocs?: string;
}) {
    log('compileGetMethodOutput all', all, 6);

    const parameters = mergeParameters(
        all.signatureParameters?.length ? all.signatureParameters : all.parameters,
        all.inheritedSignatureParameters ?? []
    );

    const returns = mergeReturns(
        all.signatureReturns,
        all.inheritedSignatureReturns || all.returns
    );

    return {
        name: all.name,
        docs: all.docs,
        docsTags: all.docsTags,
        parameters,
        returns,
    };
}
