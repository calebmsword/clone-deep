import cloneDeep, { cloneDeepAsync } from '../clone-deep/clone-deep.js';
import { cloneDeepInternal } from '../clone-deep/clone-deep-internal.js';
import { hasMethods } from '../utils/metadata.js';
import { isObject } from '../utils/type-checking.js';

/** @typedef {import('../clone-deep/clone-deep-utils/types').PerformanceConfig} PerformanceConfig */

/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * Handles internal logic for the full deep clone.
 * @template [T=any]
 * The type of the input value.
 * @template [U = T]
 * The return type of the clone.
 * @param {Object} spec
 * @param {T} spec.value
 * The value to clone.
 * @param {Customizer|undefined} spec.customizer
 * A customizer that would qualify the default behavior of `cloneDeep`.
 * @param {Log} spec.log
 * A logger.
 * @param {string|undefined} spec.logMode
 * Either "silent" or "quiet". This will configure the behavior of the default
 * logger.
 * @param {PerformanceConfig} spec.performanceConfig
 * Whether type-checking will be performed performantly.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} spec.letCustomizerThrow
 * Whether errors from the customizer will be thrown by the algorithm.
 * @param {boolean} spec.force
 * If true, then prototypes with methods will be cloned.
 * @returns {U}
 */
export const cloneDeepFullyInternal = ({
    value,
    customizer,
    log,
    logMode,
    performanceConfig,
    ignoreCloningMethods,
    letCustomizerThrow,
    force
}) => {
    /** @type {U} */
    const clone = cloneDeep(value, {
        customizer,
        log,
        logMode,
        performanceConfig,
        ignoreCloningMethods,
        letCustomizerThrow
    });

    /** @type {U} */
    let tempClone = clone;

    /** @type {any} */
    let tempOrig = value;

    const parentObjectRegistry = ignoreCloningMethods !== true
        ? new Set()
        : undefined;

    while (isObject(tempOrig)
           && Object.getPrototypeOf(tempOrig) !== null
           && (!hasMethods(Object.getPrototypeOf(tempOrig)) || force)) {

        if (ignoreCloningMethods !== true) {
            parentObjectRegistry?.add(tempOrig);
        }

        const newProto = cloneDeepInternal({
            value: Object.getPrototypeOf(tempOrig),
            customizer,
            log,
            performanceConfig,
            ignoreCloningMethods,
            doThrow: letCustomizerThrow,
            parentObjectRegistry,
            async: false
        });

        Object.setPrototypeOf(tempClone, newProto);

        tempClone = Object.getPrototypeOf(tempClone);
        tempOrig = Object.getPrototypeOf(tempOrig);
    }

    return clone;
};

/**
 * Handles internal logic for the full deep clone.
 * @template [T=any]
 * The type of the input value.
 * @template [U = T]
 * The return type of the clone.
 * @param {Object} spec
 * @param {T} spec.value
 * The value to clone.
 * @param {Customizer|undefined} spec.customizer
 * A customizer that would qualify the default behavior of `cloneDeep`.
 * @param {Log} spec.log
 * A logger.
 * @param {string|undefined} spec.logMode
 * Either "silent" or "quiet". This will configure the behavior of the default
 * logger.
 * @param {PerformanceConfig} spec.performanceConfig
 * Whether type-checking will be performed performantly.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} spec.letCustomizerThrow
 * Whether errors from the customizer will be thrown by the algorithm.
 * @param {boolean} spec.force
 * If true, then prototypes with methods will be cloned.
 * @returns {Promise<{ clone: U }>}
 */
export const cloneDeepFullyInternalAsync = async ({
    value,
    customizer,
    log,
    logMode,
    performanceConfig,
    ignoreCloningMethods,
    letCustomizerThrow,
    force
}) => {
    const { clone } = await /** @type {Promise<{ clone: U }>} */ (
        cloneDeepAsync(value, {
            customizer,
            log,
            logMode,
            performanceConfig,
            ignoreCloningMethods,
            letCustomizerThrow
        }));

    /** @type {any} */
    let tempClone = clone;

    /** @type {any} */
    let tempOrig = value;

    const parentObjectRegistry = ignoreCloningMethods !== true
        ? new Set()
        : undefined;

    /** @type Promise<{ clone: any }>[]*/
    const pendingCloneContainers = [];

    while (isObject(tempOrig)
           && Object.getPrototypeOf(tempOrig) !== null
           && (!hasMethods(Object.getPrototypeOf(tempOrig)) || force)) {

        if (ignoreCloningMethods !== true) {
            parentObjectRegistry?.add(tempOrig);
        }

        pendingCloneContainers.push(cloneDeepInternal({
            value: Object.getPrototypeOf(tempOrig),
            customizer,
            log,
            performanceConfig,
            ignoreCloningMethods,
            doThrow: letCustomizerThrow,
            parentObjectRegistry,
            async: true
        }));

        tempClone = Object.getPrototypeOf(tempClone);
        tempOrig = Object.getPrototypeOf(tempOrig);
    }

    const containers = await Promise.all(pendingCloneContainers);

    let _tempClone = clone;
    let _tempOrig = value;
    containers.forEach(({ clone: newProto }) => {
        Object.setPrototypeOf(_tempClone, newProto);

        _tempClone = Object.getPrototypeOf(_tempClone);
        _tempOrig = Object.getPrototypeOf(_tempOrig);
    });

    return { clone };
};
