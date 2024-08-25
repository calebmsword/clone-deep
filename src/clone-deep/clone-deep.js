import { defaultLog } from '../utils/clone-deep-error.js';
import { isCallable } from '../utils/type-checking.js';
import { cloneDeepInternal } from './clone-deep-internal.js';

/** @typedef {import('./clone-deep-utils/types').PerformanceConfig} PerformanceConfig */

/** @typedef {import('../types').CloneDeepProxyOptions} CloneDeepProxyOptions */

/** @typedef {import('../types').CloneDeepOptions} CloneDeepOptions */

/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * @template T
 * The type of the input value.
 * @template [U = T]
 * The type of the return value, which by default is the same as `T`. Strictly
 * speaking it is possible for the types to differ because we don't support
 * all types, and customizers and cloning methods can arbitrarily manipulate
 * the resultant type of the clone. Provide this parameter if you know what you
 * are doing.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepProxyOptions} [options]
 * @param {object} [options]
 * @param {Customizer} options.customizer
 * Allows the user to inject custom logic. The function is given the value to
 * copy. If the function returns an object, the value of the `clone` property on
 * that object will be used as the clone.
 * @param {Log} options.log
 * Any errors which occur during the algorithm can optionally be passed to a log
 * function. `log` should take one argument which will be the error encountered.
 * Use this to log the error to a custom logger.
 * @param {PerformanceConfig} [options.performanceConfig]
 * Whether type-checking will be done performantly or robustly.
 * @param {boolean} options.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {string} options.logMode
 * Case-insensitive. If "silent", no warnings will be logged. Use with caution,
 * as failures to perform true clones are logged as warnings.
 * @param {boolean} options.letCustomizerThrow
 * If `true`, errors thrown by the customizer will be thrown by `cloneDeep`. By
 * default, the error is logged and the algorithm proceeds with default
 * behavior.
 * @param {boolean} options.async
 * If `true`, the function will return a promise that resolves with the cloned
 * object.
 * @returns {U | Promise<{ clone: U }>}
 * The deep copy.
 */
const cloneDeepProxy = (value, options) => {
    /** @type {Customizer|undefined} */
    let customizer;

    /** @type {Log|undefined} */
    let log;

    /** @type {PerformanceConfig|undefined} */
    let performanceConfig;

    /** @type {string|undefined} */
    let logMode;

    /** @type {boolean|undefined} */
    let letCustomizerThrow = false;

    /** @type {boolean|undefined} */
    let ignoreCloningMethods = false;

    /** @type {boolean|undefined} */
    let async = false;

    if (options !== null && typeof options === 'object') {
        ({
            customizer,
            log,
            performanceConfig,
            logMode,
            ignoreCloningMethods,
            letCustomizerThrow,
            async
        } = options);
    }

    if (log === undefined || !isCallable(log?.warn) || !isCallable(log?.error)) {
        log = defaultLog;
    }

    if (typeof logMode === 'string' && logMode.toLowerCase() === 'silent') {
        const noop = () => {};
        log = {
            warn: noop,
            error: noop
        };
    }

    /** @type {U | Promise<{ clone: U }>} */
    return cloneDeepInternal({
        value,
        customizer,
        log,
        performanceConfig: performanceConfig || {},
        ignoreCloningMethods: ignoreCloningMethods || false,
        doThrow: letCustomizerThrow || false,
        async: async || false
    });
};

/**
 * I should be able to use conditional types to correctly have
 * cloneDeepOptionsProxy return a promise or a non-promise without problems. But
 * it does not work. See https://github.com/microsoft/TypeScript/issues/33912.
 * As a workaround, I perform some evil casting to force the return to have the
 * correct type.
 * @template T
 * The type of the input value.
 * @template [U = T]
 * See documentation for cloneDeepProxy.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepOptions} [options]
 * @returns {U}
 * See documentation for_cloneDeep.
 */
const cloneDeep = (value, options) => {
    if (options === null || typeof options !== 'object') {
        options = {};
    }

    options.async = false;

    return /** @type {U} */ (cloneDeepProxy(value, options));
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
 * See documentation for cloneDeepProxy.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepOptions} [options]
 * @returns {Promise<{ clone: U }> }
 * See documentation for_cloneDeep..
 */
export const cloneDeepAsync = (value, options) => {
    if (options === null || typeof options !== 'object') {
        options = {};
    }

    options.async = true;

    return /** @type {Promise<{ clone: U }>} */(cloneDeepProxy(value, options));
};

export default cloneDeep;
