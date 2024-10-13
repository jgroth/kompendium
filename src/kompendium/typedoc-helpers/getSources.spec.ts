import { DeclarationReflection, SourceReference } from 'typedoc';
import { getSources } from './getSources';

describe('getSources()', () => {
    it('returns an empty array when there are no sources', () => {
        const reflection: Partial<DeclarationReflection> = {
            sources: undefined,
        };
        const result = getSources(reflection as DeclarationReflection);
        expect(result).toEqual([]);
    });

    it('handles a single source', () => {
        const reflection: Partial<DeclarationReflection> = {
            sources: [
                {
                    fileName: 'type-alias.ts',
                    fullFileName:
                        '/src/kompendium/src/kompendium/test/fixtures/type-alias.ts',
                } as Partial<SourceReference> as SourceReference,
            ],
        };
        const result = getSources(reflection as DeclarationReflection);
        expect(result.length).toEqual(1);
    });

    it('handles multiple sources', () => {
        const reflection: Partial<DeclarationReflection> = {
            sources: [
                {
                    fileName: 'class.ts',
                    fullFileName:
                        '/src/kompendium/src/kompendium/test/fixtures/class.ts',
                } as Partial<SourceReference> as SourceReference,
                {
                    fileName: 'interface.ts',
                    fullFileName:
                        '/src/kompendium/src/kompendium/test/fixtures/interface.ts',
                } as Partial<SourceReference> as SourceReference,
            ],
        };
        const result = getSources(reflection as DeclarationReflection);
        expect(result.length).toEqual(2);
    });

    it.skip('handles sources without fullFileName', () => {
        const reflection: Partial<DeclarationReflection> = {
            sources: [
                {
                    fileName: 'class.ts',
                    fullFileName:
                        '/src/kompendium/src/kompendium/test/fixtures/class.ts',
                } as Partial<SourceReference> as SourceReference,
                {
                    fileName: 'unknown.ts',
                    fullFileName: undefined,
                } as Partial<SourceReference> as SourceReference,
            ],
        };
        const result = getSources(reflection as DeclarationReflection);
        expect(result.length).toEqual(1);
    });
});
