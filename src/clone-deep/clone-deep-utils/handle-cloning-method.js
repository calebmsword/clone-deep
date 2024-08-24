import { CloneError } from '../../utils/clone-deep-error.js';
import { CLONE } from '../../utils/constants.js';
import {
    isCallable,
    isObject,
    isPropertyKeyArray
} from '../../utils/type-checking.js';
import { checkParentObjectRegistry, handleCustomError } from './misc.js';

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

    const {
        log,
        pendingResults,
        parentObjectRegistry,
        async: asyncMode,
        doThrow
    } = globalState;

    const { value } = queueItem;

    /** @type {any} */
    let cloned;

    let ignoreProps = false;

    let ignoreProto = false;

    let useCloningMethod = true;

    /** @type {boolean|undefined} */
    let async;

    /** @type {Error|undefined} */
    let throwWith;

    let forceThrow = false;

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

        if (checkParentObjectRegistry(value, parentObjectRegistry)) {
            return {
                cloned,
                ignoreProps,
                ignoreProto,
                useCloningMethod: false,
                async
            };
        }

        /** @type {import('../../utils/types').CloningMethodResult} */
        const result = value[CLONE](value, log);

        if (!isObject(result)) {
            return {
                cloned,
                ignoreProps,
                ignoreProto,
                useCloningMethod: false,
                async
            };
        }

        if (result.throwWith !== undefined) {
            forceThrow = true;
            throw throwWith;
        }


        if (result.async && !asyncMode) {
            throw CloneError.CLONING_METHOD_ASYNC_IN_SYNC_MODE;
        }

        if (result.propsToIgnore !== undefined
            && !isPropertyKeyArray(result.propsToIgnore)) {
            throw CloneError.CLONING_METHOD_IMPROPER_PROPS_TO_IGNORE;
        }

        if (typeof result.useCloningMethod === 'boolean') {
            ({ useCloningMethod } = result);
        }

        if (typeof result.ignoreProps === 'boolean') {
            ({ ignoreProps } = result);
        }

        if (typeof result.ignoreProto === 'boolean') {
            ({ ignoreProto } = result);
        }

        if (Array.isArray(result.propsToIgnore)
            && isPropertyKeyArray(result.propsToIgnore)) {
            propsToIgnore.push(...result.propsToIgnore);
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
            doThrow: doThrow || forceThrow,
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
