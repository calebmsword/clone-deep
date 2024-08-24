import {
    cloneDeepFullyInternal,
    cloneDeepFullyInternalAsync
} from './clone-deep-fully-internal.js';

/** @typedef {import('../clone-deep/clone-deep-utils/types').PerformanceConfig} PerformanceConfig */

/** @typedef {import('../types').CloneDeepFullyProxyOptions} CloneDeepFullyProxyOptions */

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
 * @param {CloneDeepFullyProxyOptions} options
 * @param {object} options
 * @param {boolean} options.force
 * If `true`, prototypes with methods will be cloned. Normally, this function
 * stops if it reaches any prototype with methods.
 * @param {Customizer} options.customizer
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.ignoreCloningMethods
 * See the documentation for `cloneDeep`.
 * @param {Log} options.log
 * See the documentation for `cloneDeep`.
 * @param {PerformanceConfig} [options.performanceConfig]
 * See the documentation for `cloneDeep`.
 * @param {string} options.logMode
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.letCustomizerThrow
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.async
 * See the documentation for `cloneDeep`.
 * @returns {U | Promise<{ clone: U }>} The deep copy.
 */
const cloneDeepFullyProxy = (value, options) => {
    const {
        customizer,
        log,
        logMode,
        performanceConfig,
        ignoreCloningMethods,
        letCustomizerThrow,
        force,
        async
    } = options;

    if (!async) {
        return cloneDeepFullyInternal({
            value,
            customizer,
            log: log || console.warn,
            logMode,
            performanceConfig: performanceConfig || {},
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
        performanceConfig: performanceConfig || {},
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
 * @param {CloneDeepFullyOptions} [options]
 * @returns {U}
 * See documentation for_cloneDeep.
 */
const cloneDeepFully = (value, options) => {
    if (options === null || typeof options !== 'object') {
        options = {};
    }

    options.async = false;

    return /** @type {U} */ (cloneDeepFullyProxy(value, options));
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
 * @param {CloneDeepFullyOptions} [options]
 * @returns {Promise<{ clone: U }> }
 * See documentation for_cloneDeep..
 */
export const cloneDeepFullyAsync = (value, options) => {
    if (options === null || typeof options !== 'object') {
        options = {};
    }

    options.async = true;

    return /** @type {Promise<{ clone: U }>}*/ (
        cloneDeepFullyProxy(value, options));
};

export default cloneDeepFully;
