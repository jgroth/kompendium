import * as util from 'util';

export function log(
    // @ts-ignore
    description: string,
    // @ts-ignore
    reflection: any,
    // @ts-ignore
    depth?: number,
) {
    const options: util.InspectOptions = { colors: true };
    if (depth) {
        options.depth = depth;
    }

    // eslint-disable-next-line no-console
    console.log(`\n${description}\n\n`, util.inspect(reflection, options));
}
