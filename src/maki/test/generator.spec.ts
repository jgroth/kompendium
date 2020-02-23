import tmp from 'tmp';
import fs from 'fs';
import { maki as makiFactory } from '../generator';

describe('maki()', () => {
    let path: string;
    let tmpObject: any;
    let maki;

    beforeEach(() => {
        tmpObject = tmp.dirSync();
        path = tmpObject.name;
        maki = makiFactory({path});
    });

    afterEach(() => {
        tmpObject.removeCallback();
    });

    it('should write the maki.json file to the configured path', async () => {
        await maki({});
        expect(fs.existsSync(`${path}/maki.json`)).toBeTruthy();
    });

    it('should write the JSON data to the maki.json file', async () => {
        await maki({ foo: 'bar' });
        const json = fs.readFileSync(`${path}/maki.json`, 'utf8');
        const data = JSON.parse(json);
        expect(data).toEqual({ foo: 'bar' });
    });
});