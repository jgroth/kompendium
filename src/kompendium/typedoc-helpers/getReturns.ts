import { CommentDisplayPart, CommentTag, SignatureReflection } from 'typedoc';
import { JsonDocsMethodReturn } from '@stencil/core/internal';

export function getReturns(
    signature: SignatureReflection,
): JsonDocsMethodReturn {
    const returnDoc =
        signature.comment?.blockTags
            ?.find((tag: CommentTag) => tag.tag === '@returns')
            ?.content.map((value: CommentDisplayPart) => value.text?.trim())
            .join(' ') || '';

    return {
        type: signature.type?.toString() || '',
        docs: returnDoc,
    };
}
