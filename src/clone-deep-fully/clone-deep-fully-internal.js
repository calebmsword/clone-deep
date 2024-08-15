import cloneDeep from '../clone-deep/clone-deep.js';
import { cloneDeepInternal } from '../clone-deep/clone-deep-internal.js';
import { hasMethods } from '../utils/metadata.js';


/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * Handles internal logic for the full deep clone.
 * @template [T=any]
 * The type of the input value.
 * @template [U = T | Promise<{ result: T }>]
 * The return type of the clone.
 *
 * @param {Object} spec
 * @param {T} spec.value
 * @param {Customizer|undefined} spec.customizer
 * @param {Log} spec.log
 * @param {string|undefined} spec.logMode
 * @param {boolean} spec.prioritizePerformance
 * @param {boolean} spec.ignoreCloningMethods
 * @param {boolean} spec.letCustomizerThrow
 * @param {boolean} spec.force
 * @returns {U | Promise<{ result: U }>}
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
    /** @type {U | Promise<{ result: U }>} */
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
