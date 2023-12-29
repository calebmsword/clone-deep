const deep = require("./dist/clone-deep.cjs");
const utils = require("./dist/clone-deep-utils.cjs");

module.exports = {
    default: deep.default,
    cloneDeepFully: utils.cloneDeepFully,
    useCustomizers: utils.useCustomizers
};
