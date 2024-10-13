import { compileGetMethodOutput } from "./compileGetMethodOutput";

describe('compileGetMethodOutput', () => {
    it('returns the correct output for non-inherited docs', () => {
        const input = {
            name: 'baz',
            docs: 'Do something\n\nFrom string to number',
            docsTags: [
                {
                    name: 'sourceFile',
                    text: 'src/kompendium/test/fixtures/basic.ts'
                }
            ],
            parameters: [],
            returns: { type: '', docs: '' },
            signatureParameters: [
                {
                    name: 'args',
                    type: 'string',
                    docs: 'the string',
                    default: undefined,
                    optional: false
                }
            ],
            signatureReturns: { type: 'number', docs: 'the number' },
            signatureDocs: '',
            inheritedSignatureParameters: undefined,
            inheritedSignatureReturns: undefined,
            inheritedSignatureDocs: undefined
        };
        const expected = {
            name: 'baz',
            docs: 'Do something\n\nFrom string to number',
            docsTags: [
                {
                    name: 'sourceFile',
                    text: 'src/kompendium/test/fixtures/basic.ts'
                }
            ],
            parameters: [
                {
                    default: undefined,
                    docs: 'the string',
                    name: 'args',
                    optional: false,
                    type: 'string',
                },
            ],
            returns: {
                docs: 'the number',
                type: 'number',
            },
        };
        const result = compileGetMethodOutput(input);
        expect(result).toEqual(expected);
    });

    it('returns the correct output for inherited docs', () => {
        const input = {
            name: 'baz',
            docs: 'Do something\n\nFrom string to number',
            docsTags: [
              {
                name: 'sourceFile',
                text: 'src/kompendium/test/fixtures/basic.ts'
              }
            ],
            parameters: [],
            returns: { type: '', docs: '' },
            signatureParameters: [
              {
                name: 'args',
                type: 'string',
                docs: '',
                default: undefined,
                optional: false
              }
            ],
            signatureReturns: { type: 'number', docs: '' },
            signatureDocs: '',
            inheritedSignatureParameters: [
              {
                name: 'args',
                type: 'string',
                docs: 'the string',
                default: undefined,
                optional: false
              }
            ],
            inheritedSignatureReturns: { type: 'number', docs: 'the number' },
            inheritedSignatureDocs: ''
          };
        const expected = {
            name: 'baz',
            docs: 'Do something\n\nFrom string to number',
            docsTags: [
                {
                    name: 'sourceFile',
                    text: 'src/kompendium/test/fixtures/basic.ts'
                }
            ],
            parameters: [
                {
                    default: undefined,
                    docs: 'the string',
                    name: 'args',
                    optional: false,
                    type: 'string',
                },
            ],
            returns: {
                docs: 'the number',
                type: 'number',
            },
        };
        const result = compileGetMethodOutput(input);
        expect(result).toEqual(expected);
    });
});
