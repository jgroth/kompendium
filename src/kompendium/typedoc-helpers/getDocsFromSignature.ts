import { SignatureReflection, CommentDisplayPart } from "typedoc";
import { log } from "./logger";

export function getDocsFromSignature(signature: SignatureReflection): string {
    log('getDocsFromSignature signature.comment?.summary', signature.comment?.summary, 6);
    const result = (
        signature.comment?.summary
            .map((value: CommentDisplayPart) => value.text?.trim())
            .join(' ') || ''
    );
    log('getDocsFromSignature result', result, 6);
    return result;
}
