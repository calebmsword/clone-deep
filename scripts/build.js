import fs from 'node:fs';

const build = process.argv[2];

const readmeFilename = `./${build}/README.md`;
const packageDotJsonFilename = `./${build}/package.json`;

fs.writeFileSync(readmeFilename, 
`#cms-clone-deep-es6
This is the package for cms-clone-deep-es6.
`
);

fs.writeFileSync(packageDotJsonFilename,
`{
  "name": "cms-clone-deep",
  "repository": "https://github.com/calebmsword/clone-deep",
  "type": "module",
  "version": "1.0.17",
  "description": "A dependency-free utility for deeply cloning JavaScript objects.",
  "main": "index.js",
  "types": "cms-clone-deep.d.ts",
  "keywords": [
    "clone",
    "deep"
  ],
  "author": "Caleb Sword",
  "license": "MIT",
  "devDependencies": {
    "@stylistic/eslint-plugin-js": "^2.6.2",
    "eslint": "^9.9.0",
    "globals": "^15.9.0",
    "typescript": "^5.3.3"
  }
}
`
);