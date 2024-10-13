import { CommentDisplayPart, Reflection } from 'typedoc';
import { log } from './logger';

export function getDocs(reflection: Reflection): string {
    log('getDocs reflection.comment?.summary', reflection.comment?.summary, 6);
    const result = [
        reflection.comment?.summary
            ?.map((value: CommentDisplayPart) => value.text?.trim())
            .join(' '),
    ]
        .filter(Boolean)
        .join('\n')
        .trim();

    log('getDocs result', result, 6);
    return result;
}
