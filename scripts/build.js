/* eslint-disable @s/max-len */

import fs from 'node:fs';

const VERSION = process.argv[2];

console.log(
    `\nWriting package.json and README.md with version: ${VERSION}.`);

const regexp = /[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/;
if (!Array.isArray(regexp.exec(VERSION))) {
    throw new Error(
        `Provided version ${VERSION} is in the incorrect format. Use the ` +
        'command `npm run build -- <VERSION>` to provide a proper version ' +
        'number. See https://docs.npmjs.com/about-semantic-versioning for ' +
        'more information.');
}

const packageDotJson = `{
  "name": "cms-clone-deep-es5",
  "repository": "https://github.com/calebmsword/clone-deep/build",
  "type": "commonjs",
  "version": "${VERSION}",
  "description": "A dependency-free utility for deeply cloning JavaScript objects.",
  "main": "index.js",
  "types": "index.d.ts",
  "keywords": [
    "clone",
    "deep",
    "cms"
  ],
  "author": "Caleb Sword",
  "license": "MIT"
}
`;

const readme = `
# cms-clone-deep-es5

This package is a bundled, es5-compliant version of [cms-clone-deep](https://github.com/calebmsword/clone-deep).

`;

try {
    console.log('Writing package.json...');
    fs.writeFileSync('./build/package.json', packageDotJson);
    console.log('Writing README.md...');
    fs.writeFileSync('./build/README.md', readme);
    console.log('Success!');
} catch (error) {
    console.log(error);
}
