import { CommentDisplayPart, SignatureReflection } from 'typedoc';
import { ParameterDescription } from '../../types';

export function getParameters(
    signature: SignatureReflection,
): ParameterDescription[] {
    return (
        signature.parameters?.map((param) => {
            const paramDoc =
                param.comment?.summary
                    .map((value: CommentDisplayPart) => value.text?.trim())
                    .join(' ') || '';

            return {
                name: param.name,
                type: param.type?.toString() || '',
                docs: paramDoc,
                default: param.defaultValue,
                optional: param.flags.isOptional,
            };
        }) || []
    );
}
