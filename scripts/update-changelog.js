const { argv } = require('yargs');
const fs = require('fs');

function updateChangelog() {
    const vermoji = argv.vermoji;
    if (!vermoji) {
        return;
    }

    const filename = 'CHANGELOG.md';
    let changelog = fs.readFileSync(filename, 'utf8');
    changelog = changelog.replace(/# \[/, '# ' + vermoji + ' [');
    fs.writeFileSync(filename, changelog);
}

updateChangelog();
