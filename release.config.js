const generateVermoji = require('./scripts/utils/vermoji');
const vermoji = generateVermoji('./CHANGELOG.md');

module.exports = {
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/npm',
        ['@semantic-release/git', {
            message: `${vermoji} <%= nextRelease.version %>`
        }],
        '@semantic-release/github',
    ],
    dryRun: true
};
