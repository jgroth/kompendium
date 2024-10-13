import * as path from 'path';
import { DeclarationReflection } from 'typedoc';

export function getSources(reflection: DeclarationReflection) {
    return (
        reflection.sources?.map(
            (source) =>
                source.fullFileName &&
                path.relative(process.cwd(), source.fullFileName),
        ) || []
    );
}
