/* eslint-disable complexity */

import { Warning } from '../../utils/clone-deep-warning.js';
import { CLONE } from '../../utils/constants.js';
import { isCallable, isPropertyKeyArray } from '../../utils/type-checking.js';
import { handleCustomError } from './misc.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Handles the return value from a cloning method.
 * @param {Object} spec
 * @param {any} spec.value
 * The value to clone.
 * @param {symbol|object|Assigner} [spec.parentOrAssigner]
 * Either the parent object that the cloned value will be assigned to, or a
 * function which assigns the value itself. If equal to `TOP_LEVEL`, then it
 * is the value that will be returned by the algorithm.
 * @param {string|symbol} [spec.prop]
 * If this value is a nested value being cloned, this is the property on the
 * parent object which contains the value being cloned.
 * @param {PropertyDescriptor} [spec.metadata]
 * The optional property descriptor for this value, if it has one.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods should even be considered.
 * @param {boolean} spec.ignoreCloningMethodsThisLoop
 * Whether cloning methods should be considered for this particular value.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {import('../../types').Log} spec.log
 * A logger.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @param {import('../../types').PendingResultItem[]} [spec.pendingResults]
 * The list of clones that must be resolved asynchronously.
 * @param {boolean} [spec.async]
 * Whether this algorithm is in async mode.
 * @param {boolean} [spec.doThrow]
 * Whether errors thrown by customizers or cloning methods should be thrown by
 * the algorithm.
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean,
 *     ignoreProto: boolean,
 *     useCloningMethod: boolean,
 *     async?: boolean
 * }}
 */
export const handleCloningMethods = ({
    value,
    parentOrAssigner,
    prop,
    metadata,
    ignoreCloningMethods,
    ignoreCloningMethodsThisLoop,
    propsToIgnore,
    log,
    saveClone,
    pendingResults,
    async: asyncMode,
    doThrow
}) => {

    /** @type {any} */
    let cloned;

    let ignoreProps = false;

    let ignoreProto = false;

    let useCloningMethod = true;

    /** @type {boolean|undefined} */
    let async;

    try {
        if (ignoreCloningMethods || ignoreCloningMethodsThisLoop
            || !isCallable(value[CLONE])) {
            return {
                cloned,
                ignoreProps,
                ignoreProto,
                useCloningMethod: false,
                async
            };
        }

        /** @type {import('../../utils/types').CloningMethodResult<any>} */
        const result = value[CLONE]();

        if (result.async === true && !asyncMode) {
            throw Warning.CLONING_METHOD_ASYNC_IN_SYNC_MODE;
        }

        if (result.propsToIgnore !== undefined
            && !isPropertyKeyArray(result.propsToIgnore)) {
            throw Warning.CLONING_METHOD_IMPROPER_PROPS_TO_IGNORE;
        }

        if (Array.isArray(result.propsToIgnore)
            && isPropertyKeyArray(result.propsToIgnore)) {
            propsToIgnore.push(...result.propsToIgnore);
        }

        if (typeof result.ignoreProps === 'boolean') {
            ({ ignoreProps } = result);
        }

        if (typeof result.ignoreProto === 'boolean') {
            ({ ignoreProto } = result);
        }

        if (!result.async) {
            cloned = saveClone(result.clone);
        } else {
            async = true;
            pendingResults?.push({
                value,
                parentOrAssigner,
                prop,
                metadata,
                promise: Promise.resolve(result.clone),
                ignoreProto,
                ignoreProps,
                propsToIgnore
            });
        }

    } catch (error) {
        useCloningMethod = handleCustomError({
            log,
            error,
            doThrow,
            name: 'Cloning method'
        });
    }

    return {
        cloned,
        ignoreProps,
        ignoreProto,
        useCloningMethod,
        async
    };
};
