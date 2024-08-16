import { Warning } from '../../utils/clone-deep-warning.js';
import { isObject } from '../../utils/type-checking.js';
import { handleCustomError } from './misc.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Processes the return value from the provided customizer.
 * This may have the side effect of saving the cloned value to some persistent
 * place, as well as pushing more elements in the appropriate queue if
 * necessary. Errors from the customizers are also handled here.
 * @param {Object} spec
 * @param {import('../../types').Log} spec.log
 * @param {import('../../types').QueueItem[]} spec.queue
 * @param {import('../../types').Customizer} spec.customizer
 * @param {any} spec.value
 * @param {symbol|object|Assigner} [spec.parentOrAssigner]
 * @param {string|symbol} [spec.prop]
 * @param {PropertyDescriptor} [spec.metadata]
 * @param {(clone: any) => any} spec.saveClone
 * @param {boolean} spec.doThrow
 * @param {import('../../types').AsyncResultItem[]} [spec.pendingResults]
 * @param {boolean} [spec.async]
 * @returns {{
 *     cloned: any,
 *     useCustomizerClone: boolean,
 *     ignoreProto: boolean|undefined,
 *     ignoreProps: boolean|undefined,
 *     ignoreThisLoop: boolean,
 *     async?: boolean
 * }}
 */
export const handleCustomizer = ({
    log,
    queue,
    customizer,
    value,
    parentOrAssigner,
    prop,
    metadata,
    saveClone,
    doThrow,
    pendingResults,
    async: asyncMode
}) => {

    /** @type {any} */
    let cloned;

    /** @type {boolean} */
    let useCustomizerClone = false;

    /** @type {import('../../utils/types').AdditionalValue[]|undefined} */
    let additionalValues;

    /** @type {boolean|undefined} */
    let ignoreProps;

    /** @type {boolean|undefined} */
    let ignoreProto;

    /** @type {boolean|undefined} */
    let ignoreThisLoop = false;

    /** @type {boolean|undefined} */
    let async;

    try {
        const customResult = customizer(value);

        if (typeof customResult === 'object') {
            useCustomizerClone = true;

            ({
                additionalValues,
                ignoreProps,
                ignoreProto,
                async
            } = customResult);

            if (customResult.ignore === true) {
                ignoreThisLoop = true;
            } else {
                if (!asyncMode) {
                    if (async) {
                        throw Warning.CUSTOMIZER_ASYNC_IN_SYNC_MODE;
                    }
                    cloned = saveClone(customResult.clone);
                } else {
                    pendingResults?.push({
                        value,
                        parentOrAssigner,
                        prop,
                        metadata,
                        promise: Promise.resolve(customResult.clone),
                        ignoreProto,
                        ignoreProps,
                        propsToIgnore: []
                    });
                }

                if (Array.isArray(additionalValues)) {
                    additionalValues.forEach((object) => {
                        if (object !== undefined && isObject(object)
                            && typeof object.assigner === 'function') {
                            if (object.async === true) {
                                if (!asyncMode) {
                                    throw Warning
                                        .ADDITIONAL_VALUES_ASYNC_IN_SYNC_MODE;
                                }
                                pendingResults?.push({
                                    value,
                                    promise: Promise.resolve(object.value),
                                    parentOrAssigner: object.assigner,
                                    propsToIgnore: []
                                });
                            } else {
                                queue.push({
                                    value: object.value,
                                    parentOrAssigner: object.assigner
                                });
                            }
                        } else {
                            throw Warning.IMPROPER_ADDITIONAL_VALUES;
                        }
                    });
                } else if (additionalValues !== undefined) {
                    throw Warning.IMPROPER_ADDITIONAL_VALUES;
                }
            }
        }
    } catch (error) {
        useCustomizerClone = handleCustomError({
            log,
            error,
            doThrow,
            name: 'Customizer'
        });
    }

    return {
        cloned,
        useCustomizerClone,
        ignoreProto,
        ignoreProps,
        ignoreThisLoop,
        async
    };
};
