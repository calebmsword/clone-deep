import cloneDeep from '../clone-deep/clone-deep.js';
import { cloneDeepInternal } from '../clone-deep/clone-deep-internal.js';
import { hasMethods } from '../utils/metadata.js';
import { isObject } from '../utils/type-checking.js';


/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * Handles internal logic for the full deep clone.
 * @template [T=any]
 * The type of the input value.
 * @template [U = T | Promise<{ clone: T }>]
 * The return type of the clone.
 *
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
 * @param {boolean} spec.prioritizePerformance
 * Whether type-checking will be performed performantly.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} spec.letCustomizerThrow
 * Whether errors from the customizer will be thrown by the algorithm.
 * @param {boolean} spec.force
 * If true, then prototypes with methods will be cloned.
 * @returns {U | Promise<{ clone: U }>}
 */
export const cloneDeepFullyInternal = ({
    value,
    customizer,
    log,
    logMode,
    prioritizePerformance,
    ignoreCloningMethods,
    letCustomizerThrow,
    force
}) => {
    /** @type {U | Promise<{ clone: U }>} */
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
            prioritizePerformance,
            ignoreCloningMethods,
            doThrow: letCustomizerThrow,
            parentObjectRegistry
        });

        Object.setPrototypeOf(tempClone, newProto);

        tempClone = Object.getPrototypeOf(tempClone);
        tempOrig = Object.getPrototypeOf(tempOrig);
    }

    return clone;
};
