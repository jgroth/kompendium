import { CommentTag, Reflection } from 'typedoc';
import { JsonDocsTag } from '@stencil/core/internal';

export function getDocsTags(reflection: Reflection): JsonDocsTag[] {
    return (
        reflection.comment?.blockTags
            ?.filter(
                (tag: CommentTag) =>
                    tag.tag !== '@param' && tag.tag !== '@returns',
            )
            .map((tag: CommentTag) => ({
                name: tag.tag.replace(/^@/, '').trim(),
                text:
                    tag.content?.map((val) => val.text?.trim()).join(' ') || '',
            })) || []
    );
}
