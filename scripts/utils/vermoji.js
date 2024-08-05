/* eslint-env node */
const fs = require('fs');
const VERMOJIS = require('./emojis');

module.exports = function getVermoji(changelogPath) {
    const changelog = fs.readFileSync(changelogPath, 'utf8');

    while (true) {
        const vermoji =
            VERMOJIS[Math.round(Math.random() * (VERMOJIS.length - 1))];
        if (!changelog.includes(vermoji)) {
            return vermoji;
        }
    }
};
