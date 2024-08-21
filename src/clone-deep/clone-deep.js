/* eslint-disable complexity */

import { cloneDeepInternal } from './clone-deep-internal.js';

/** @typedef {import('../types').CloneDeepOptions} CloneDeepOptions */

/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * @template T
 * The type of the input value.
 * @template [U = T]
 * The type of the return value. By default, it is the same as the input value.
 * Nefarious customizer usage could require them be distinct, however. Please do
 * not do this.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepOptions|Customizer} [optionsOrCustomizer]
 * If a function, this argument is used as the customizer.
 * @param {object} [optionsOrCustomizer]
 * If an object, this argument is used as a configuration object.
 * @param {Customizer} optionsOrCustomizer.customizer
 * Allows the user to inject custom logic. The function is given the value to
 * copy. If the function returns an object, the value of the `clone` property on
 * that object will be used as the clone.
 * @param {Log} optionsOrCustomizer.log
 * Any errors which occur during the algorithm can optionally be passed to a log
 * function. `log` should take one argument which will be the error encountered.
 * Use this to log the error to a custom logger.
 * @param {boolean} optionsOrCustomizer.prioritizePerformance
 * Whether type-checking will be done performantly or robustly.
 * @param {boolean} optionsOrCustomizer.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {string} optionsOrCustomizer.logMode
 * Case-insensitive. If "silent", no warnings will be logged. Use with caution,
 * as failures to perform true clones are logged as warnings. If "quiet", the
 * stack trace of the warning is ignored.
 * @param {boolean} optionsOrCustomizer.letCustomizerThrow
 * If `true`, errors thrown by the customizer will be thrown by `cloneDeep`. By
 * default, the error is logged and the algorithm proceeds with default
 * behavior.
 * @param {boolean} optionsOrCustomizer.async
 * If `true`, the function will return a promise that resolves with the cloned
 * object.
 * @returns {U | Promise<{ clone: U }>}
 * The deep copy.
 */
const cloneDeepOptionsProxy = (value, optionsOrCustomizer) => {
    /** @type {Customizer|undefined} */
    let customizer;

    /** @type {Log|undefined} */
    let log;

    /** @type {boolean|undefined} */
    let prioritizePerformance;

    /** @type {string|undefined} */
    let logMode;

    /** @type {boolean|undefined} */
    let letCustomizerThrow = false;

    /** @type {boolean|undefined} */
    let ignoreCloningMethods = false;

    /** @type {boolean|undefined} */
    let async = false;

    if (typeof optionsOrCustomizer === 'function') {
        customizer = optionsOrCustomizer;
    } else if (typeof optionsOrCustomizer === 'object') {
        ({
            customizer,
            log,
            prioritizePerformance,
            logMode,
            ignoreCloningMethods,
            letCustomizerThrow,
            async
        } = optionsOrCustomizer);
    }

    if (typeof log !== 'function') {
        log = console.warn;
    }

    if (typeof logMode === 'string') {
        if (logMode.toLowerCase() === 'silent') {
            log = () => {};
        } else if (logMode.toLowerCase() === 'quiet') {
            log = console.warn;
        }
    }

    /** @type {U | Promise<{ clone: U }>} */
    return cloneDeepInternal({
        value,
        customizer,
        log,
        prioritizePerformance: prioritizePerformance || false,
        ignoreCloningMethods: ignoreCloningMethods || false,
        doThrow: letCustomizerThrow || false,
        async: async || false
    });
};

/**
 * I should be able to use conditional types to correctly have
 * cloneDeepOptionsProxy return a promise or a non-promise without problems. But
 * it does not work. See https://github.com/microsoft/TypeScript/issues/33912.
 * As a workaround, I perform some evil "casting" to force the return to have
 * the correct type.
 * @template T
 * The type of the input value.
 * @template [U = T]
 * See documentation for_cloneDeep.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepOptions|Customizer} [optionsOrCustomizer]
 * See documentation for_cloneDeep.
 * @param {object} [optionsOrCustomizer]
 * See documentation for_cloneDeep.
 * @param {Customizer} optionsOrCustomizer.customizer
 * See documentation for_cloneDeep.
 * @param {Log} optionsOrCustomizer.log
 * See documentation for_cloneDeep.
 * @param {boolean} optionsOrCustomizer.prioritizePerformance
 * See documentation for_cloneDeep.
 * @param {boolean} optionsOrCustomizer.ignoreCloningMethods
 * See documentation for_cloneDeep.
 * @param {string} optionsOrCustomizer.logMode
 * See documentation for_cloneDeep.
 * @param {boolean} optionsOrCustomizer.letCustomizerThrow
 * See documentation for_cloneDeep.
 * @returns {U}
 * See documentation for_cloneDeep..
 */
const cloneDeep = (value, optionsOrCustomizer) => {
    if (optionsOrCustomizer !== null
        && typeof optionsOrCustomizer === 'object') {
        optionsOrCustomizer.async = false;
    }

    /** @type {any} */
    const __result = cloneDeepOptionsProxy(value, optionsOrCustomizer);

    /** @type {U} */
    const result = __result;

    return result;
};

/**
 * I should be able to use conditional types to correctly have _cloneDeep return
 * a promise or a non-promise without problems. But it does not work.
 * See https://github.com/microsoft/TypeScript/issues/33912.
 * As a workaround, I perform some evil "casting" to force the return to have
 * the correct type.
 * @template T
 * The type of the input value.
 * @template [U = T]
 * See documentation for_cloneDeep.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepOptions|Customizer} [optionsOrCustomizer]
 * See documentation for_cloneDeep.
 * @param {object} [optionsOrCustomizer]
 * See documentation for_cloneDeep.
 * @param {Customizer} optionsOrCustomizer.customizer
 * See documentation for_cloneDeep.
 * @param {Log} optionsOrCustomizer.log
 * See documentation for_cloneDeep.
 * @param {boolean} optionsOrCustomizer.prioritizePerformance
 * See documentation for_cloneDeep.
 * @param {boolean} optionsOrCustomizer.ignoreCloningMethods
 * See documentation for_cloneDeep.
 * @param {string} optionsOrCustomizer.logMode
 * See documentation for_cloneDeep.
 * @param {boolean} optionsOrCustomizer.letCustomizerThrow
 * See documentation for_cloneDeep.
 * @returns {Promise<{ clone: U }> }
 * See documentation for_cloneDeep..
 */
export const cloneDeepAsync = (value, optionsOrCustomizer) => {
    if (typeof optionsOrCustomizer === 'function') {
        optionsOrCustomizer = {
            customizer: optionsOrCustomizer,
            async: true
        };
    }
    if (optionsOrCustomizer === undefined) {
        optionsOrCustomizer = {};
    }
    if (optionsOrCustomizer !== null
        && typeof optionsOrCustomizer === 'object') {
        optionsOrCustomizer.async = true;
    }

    /** @type {any} */
    const __result = cloneDeepOptionsProxy(value, optionsOrCustomizer);

    /** @type {Promise<{ clone: U }>} */
    const result = __result;

    return result;
};

export default cloneDeep;
