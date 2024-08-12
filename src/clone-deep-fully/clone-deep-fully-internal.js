import cloneDeep from '../clone-deep/clone-deep.js';
import { cloneDeepInternal } from '../clone-deep/clone-deep-internal.js';
import { hasMethods } from '../utils/metadata.js';


/** @typedef {import("../types.js").Customizer} Customizer */

/** @typedef {import("../types.js").Log} Log */

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
export const cloneDeepFullyInternal = (value,
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
