import { getStyleFiles } from '../source';

describe('getStyleFiles()', () => {
    it('returns the name of the style files for the component', () => {
        const string = `@Component({
            tag: 'kompendium-example-markdown',
            shadow: true,
            styleUrl: 'markdown.scss'
        })`;
        expect(getStyleFiles(string)).toEqual(['markdown.scss']);
    });
});
