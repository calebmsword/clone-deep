/* node:coverage disable */

import nodeAssert from 'node:assert';
import { describe as nodeDescribe, test as nodeTest } from 'node:test';

// we will monkeypatch console.warn in a second, so hold onto the original
// implementation for safekeeping
const consoleDotWarn = console.warn;

// convenient helper functions
export const getProto = (object) => {
    return Object.getPrototypeOf(object);
};
export const tagOf = (value) => {
    return Object.prototype.toString.call(value);
};

nodeAssert.true = (condition) => {
    nodeAssert.strictEqual(true, condition);
};

nodeAssert.truthy = (condition) => {
    nodeAssert.strictEqual(true, Boolean(condition));
};

nodeAssert.false = (condition) => {
    nodeAssert.strictEqual(false, condition);
};

nodeAssert.undefined = (condition) => {
    nodeAssert.strictEqual(undefined, condition);
};

nodeAssert.deepClone = (object1, object2) => {
    nodeAssert.notStrictEqual(object1, object2);
    nodeAssert.deepEqual(object1, object2);
};

export const test = (...args) => {
    try {
        console.warn = () => {};
        nodeTest(...args);
    } catch (error) {
        console.warn = consoleDotWarn;
        throw error;
    }
};

export const describe = (...args) => {
    try {
        console.warn = () => {};
        nodeDescribe(...args);
    } catch (error) {
        console.warn = consoleDotWarn;
        throw error;
    }
};

export const assert = nodeAssert;