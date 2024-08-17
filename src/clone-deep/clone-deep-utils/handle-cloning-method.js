/* eslint-disable complexity */

import { Warning } from '../../utils/clone-deep-warning.js';
import { CLONE } from '../../utils/constants.js';
import { isCallable } from '../../utils/type-checking.js';
import { handleCustomError } from './misc.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {any} spec.value
 * @param {symbol|object|Assigner} [spec.parentOrAssigner]
 * @param {string|symbol} [spec.prop]
 * @param {PropertyDescriptor} [spec.metadata]
 * @param {boolean} spec.ignoreCloningMethods
 * @param {boolean} spec.ignoreCloningMethodsThisLoop
 * @param {(string|symbol)[]} spec.propsToIgnore
 * @param {import('../../types').Log} spec.log
 * @param {(clone: any) => any} spec.saveClone
 * @param {import('../../types').PendingResultItem[]} [spec.pendingResults]
 * @param {boolean} [spec.async]
 * @param {boolean} [spec.doThrow]
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
        if (isCallable(value[CLONE])
            && ignoreCloningMethods !== true
            && ignoreCloningMethodsThisLoop === false) {

            /** @type {import('../../utils/types').CloneMethodResult<any>} */
            const result = value[CLONE]();

            if (result.async === true && !asyncMode) {
                throw Warning.CLONING_METHOD_ASYNC_IN_SYNC_MODE;
            }

            if (result.propsToIgnore !== undefined) {
                if (Array.isArray(result.propsToIgnore)
                    && result.propsToIgnore.every(
                        /** @param {any} string */
                        (string) => {
                            return ['string', 'symbol']
                                .includes(typeof string);
                        })) {
                    propsToIgnore.push(...result.propsToIgnore);
                } else {
                    log(Warning.CLONING_METHOD_IMPROPER_PROPS_TO_IGNORE);
                }
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

        } else {
            useCloningMethod = false;
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
