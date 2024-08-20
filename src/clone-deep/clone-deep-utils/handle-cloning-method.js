/* eslint-disable complexity */

import { Warning } from '../../utils/clone-deep-warning.js';
import { CLONE } from '../../utils/constants.js';
import { isCallable, isPropertyKeyArray } from '../../utils/type-checking.js';
import { handleCustomError } from './misc.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Handles the return value from a cloning method.
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean,
 *     ignoreProto: boolean,
 *     useCloningMethod: boolean,
 *     async?: boolean
 * }}
 */
export const handleCloningMethods = ({
    globalState,
    queueItem,
    propsToIgnore,
    saveClone
}) => {

    const { log, pendingResults, async: asyncMode, doThrow } = globalState;

    const { value } = queueItem;

    /** @type {any} */
    let cloned;

    let ignoreProps = false;

    let ignoreProto = false;

    let useCloningMethod = true;

    /** @type {boolean|undefined} */
    let async;

    try {
        if (!isCallable(value[CLONE])) {
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
                queueItem,
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
