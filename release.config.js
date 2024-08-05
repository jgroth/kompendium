const generateVermoji = require('./scripts/utils/vermoji');
const vermoji = generateVermoji('./CHANGELOG.md');

module.exports = {
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        [
            '@semantic-release/exec',
            {
                prepareCmd: `npm run update-changelog -- --vermoji=${vermoji}`,
            },
        ],
        '@semantic-release/npm',
        [
            '@semantic-release/git',
            {
                message: `${vermoji} <%= nextRelease.version %>\n\n[skip ci]`,
            },
        ],
        '@semantic-release/github',
    ],
};
