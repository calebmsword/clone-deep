import cloneDeep from './clone-deep/clone-deep.js';
import { cloneDeepInternal } from './clone-deep/clone-deep-internal.js';
import { hasMethods } from './utils/metadata.js';

/** @typedef {import("./types").Customizer} Customizer */

/** @typedef {import("./types").Log} Log */

/**
 * Handles internal logic for the full deep clone.
 * @template [T=any]
 * The type of the input value.
 * @template [U=T]
 * The return type of the clone.
 *
 * @param {T} value n
 * @param {Customizer|undefined} customizer
 * @param {Log} log
 * @param {string|undefined} logMode
 * @param {boolean} prioritizePerformance
 * @param {boolean} ignoreCloningMethods
 * @param {boolean} letCustomizerThrow
 * @param {boolean} force
 * @returns {U}
 */
const cloneDeepFullyInternal = (value,
                                customizer,
                                log,
                                logMode,
                                prioritizePerformance,
                                ignoreCloningMethods,
                                letCustomizerThrow,
                                force) => {
    /** @type {U} */
    const clone = cloneDeep(value, {
        customizer,
        log,
        logMode,
        prioritizePerformance,
        ignoreCloningMethods,
        letCustomizerThrow
    });

    /** @type {any} */
    let tempClone = clone;

    /** @type {any} */
    let tempOrig = value;

    const parentObjectRegistry = ignoreCloningMethods !== true
        ? new Set()
        : undefined;

    while (tempOrig !== null && ['object', 'function'].includes(typeof tempOrig)
           && Object.getPrototypeOf(tempOrig) !== null
           && (!hasMethods(Object.getPrototypeOf(tempOrig)) || force)) {

        if (ignoreCloningMethods !== true) {
            parentObjectRegistry?.add(tempOrig);
        }

        const newProto = cloneDeepInternal(Object.getPrototypeOf(tempOrig),
                                           customizer,
                                           log,
                                           prioritizePerformance,
                                           ignoreCloningMethods,
                                           letCustomizerThrow,
                                           parentObjectRegistry);

        Object.setPrototypeOf(tempClone, newProto);

        tempClone = Object.getPrototypeOf(tempClone);
        tempOrig = Object.getPrototypeOf(tempOrig);
    }

    return clone;
};

/** @typedef {import("./types").CloneDeepFullyOptions} CloneDeepFullyOptions */

/**
 * Deeply clones the provided object and its prototype chain.
 * @template T
 * See the documentation for `cloneDeep`.
 * @template [U = T]
 * See the documentation for `cloneDeep`.
 * @param {T} value
 * The object to clone.
 * @param {CloneDeepFullyOptions|Customizer} [options]
 * If a function, it is used as the customizer for the clone.
 * @param {object} [options]
 * If an object, it is used as a configuration object. See the documentation for
 * `cloneDeep`.
 * @param {boolean} options.force
 * If `true`, prototypes with methods will be cloned. Normally, this function
 * stops if it reaches any prototype with methods.
 * @param {Customizer} options.customizer
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.ignoreCloningMethods
 * See the documentation for `cloneDeep`.
 * @param {Log} options.log
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.prioritizePerformance
 * See the documentation for `cloneDeep`.
 * @param {string} options.logMode
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.letCustomizerThrow
 * See the documentation for `cloneDeep`.
 * @returns {U} The deep copy.
 */
const cloneDeepFully = (value, options) => {
    if (typeof options !== 'object' && typeof options !== 'function') {
        options = {};
    }

    let customizer;
    let log;
    let logMode;
    let prioritizePerformance;
    let ignoreCloningMethods;
    let letCustomizerThrow;
    let force;

    if (typeof options === 'function') {
        customizer = options;
    } else {
        ({
            customizer,
            log,
            logMode,
            prioritizePerformance,
            ignoreCloningMethods,
            letCustomizerThrow,
            force
        } = options);
    }

    return cloneDeepFullyInternal(value,
                                  customizer,
                                  log || console.warn,
                                  logMode,
                                  prioritizePerformance || false,
                                  ignoreCloningMethods || false,
                                  letCustomizerThrow || false,
                                  force || false);
};

export default cloneDeepFully;
