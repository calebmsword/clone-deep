import { cloneDeepFullyInternal } from './clone-deep-fully-internal.js';

/** @typedef {import('../types').CloneDeepFullyOptions} CloneDeepFullyOptions */

/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * Deeply clones the provided object and its prototype chain.
 * @template T
 * See the documentation for `cloneDeep`.
 * @template [U = T | Promise<{ result: T }>]
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
 * @returns {U | Promise<{ result: U }>} The deep copy.
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
    } else if (typeof options === 'object') {
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

    return cloneDeepFullyInternal({
        value,
        customizer,
        log: log || console.warn,
        logMode,
        prioritizePerformance: prioritizePerformance || false,
        ignoreCloningMethods: ignoreCloningMethods || false,
        letCustomizerThrow: letCustomizerThrow || false,
        force: force || false
    });
};

export default cloneDeepFully;
