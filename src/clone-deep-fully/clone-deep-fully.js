/* eslint-disable complexity */

import {
    cloneDeepFullyInternal,
    cloneDeepFullyInternalAsync
} from './clone-deep-fully-internal.js';

/** @typedef {import('../types').CloneDeepFullyOptions} CloneDeepFullyOptions */

/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * Deeply clones the provided object and its prototype chain.
 * @template T
 * See the documentation for `cloneDeep`.
 * @template [U = T | Promise<{ clone: T }>]
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
 * @param {boolean} options.async
 * See the documentation for `cloneDeep`.
 * @returns {U | Promise<{ clone: U }>} The deep copy.
 */
const cloneDeepFullyOptionsProxy = (value, options) => {
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
    let async;

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
            force,
            async
        } = options);
    }

    if (!async) {
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
    }
    return cloneDeepFullyInternalAsync({
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

/**
 * I should be able to use conditional types to correctly have
 * cloneDeepFullyOptionsProxy return a promise or a non-promise without
 * problems. But it does not work. See https://github.com/microsoft/TypeScript/issues/33912.
 * As a workaround, I perform some evil "casting" to force the return to have
 * the correct type.
 * @template T
 * The type of the input value.
 * @template [U = T]
 * See documentation for_cloneDeep.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepFullyOptions|Customizer} [optionsOrCustomizer]
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
const cloneDeepFully = (value, optionsOrCustomizer) => {
    if (optionsOrCustomizer !== null
        && typeof optionsOrCustomizer === 'object') {
        optionsOrCustomizer.async = false;
    }

    /** @type {any} */
    const __result = cloneDeepFullyOptionsProxy(value, optionsOrCustomizer);

    /** @type {U} */
    const result = __result;

    return result;
};

/**
 * I should be able to use conditional types to correctly have
 * cloneDeepFullyOptionsProxy return a promise or a non-promise without
 * problems. But it does not work. See https://github.com/microsoft/TypeScript/issues/33912.
 * As a workaround, I perform some evil "casting" to force the return to have
 * the correct type.
 * @template T
 * The type of the input value.
 * @template [U = T]
 * See documentation for_cloneDeep.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepFullyOptions|Customizer} [optionsOrCustomizer]
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
export const cloneDeepFullyAsync = (value, optionsOrCustomizer) => {
    if (typeof optionsOrCustomizer === 'function') {
        optionsOrCustomizer = {
            customizer: optionsOrCustomizer,
            async: true
        };
    }
    if (optionsOrCustomizer === null || optionsOrCustomizer === undefined) {
        optionsOrCustomizer = {};
    }
    if (optionsOrCustomizer !== null
        && typeof optionsOrCustomizer === 'object') {
        optionsOrCustomizer.async = true;
    }

    /** @type {any} */
    const __result = cloneDeepFullyOptionsProxy(value, optionsOrCustomizer);

    /** @type {Promise<{ clone: U }>}*/
    const result = __result;

    return result;
};

export default cloneDeepFully;
