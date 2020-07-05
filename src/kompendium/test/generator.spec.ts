import tmp from 'tmp';
import fs from 'fs';
import { kompendiumGenerator } from '../generator';

describe('kompendium()', () => {
    let path: string;
    let tmpObject: any;
    let kompendium;

    beforeEach(() => {
        tmpObject = tmp.dirSync();
        path = tmpObject.name;
        kompendium = kompendiumGenerator({path});
    });

    afterEach(() => {
        tmpObject.removeCallback();
    });

    it('should write the kompendium.json file to the configured path', async () => {
        await kompendium({});
        expect(fs.existsSync(`${path}/kompendium.json`)).toBeTruthy();
    });

    it('should write the JSON data to the kompendium.json file', async () => {
        await kompendium({ foo: 'bar' });
        const json = fs.readFileSync(`${path}/kompendium.json`, 'utf8');
        const data = JSON.parse(json);
        expect(typeof data).toEqual('object');
        expect(data.docs).toEqual({ foo: 'bar', components: [] });
    });
});
