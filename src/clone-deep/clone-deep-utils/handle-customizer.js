import { Warning } from '../../utils/clone-deep-warning.js';
import { handleAdditionalValues } from './handle-additional-values.js';
import { handleCustomError } from './misc.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Processes the return value from the provided customizer.
 * This may have the side effect of saving the cloned value to some persistent
 * place, as well as pushing more elements in the appropriate queue if
 * necessary. Errors from the customizers are also handled here.
 * @param {Object} spec
 * @param {import('../../types').Log} spec.log
 * The logger.
 * @param {import('../../types').QueueItem[]} spec.queue
 * The queue of values to clone.
 * @param {import('../../types').Customizer} spec.customizer
 * The customizer used to qualify the default behavior of cloneDeepInternal.
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
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @param {boolean} [spec.doThrow]
 * Whether errors thrown by customizers or cloning methods should be thrown by
 * the algorithm.
 * @param {import('../../types').PendingResultItem[]} [spec.pendingResults]
 * The list of clones that must be resolved asynchronously.
 * @param {boolean} [spec.async]
 * Whether this algorithm is in async mode.
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

    /** @type {boolean} */
    const ignoreThisLoop = false;

    /** @type {boolean|undefined} */
    let async;

    try {
        const customResult = customizer(value);

        if (typeof customResult !== 'object') {
            return {
                cloned,
                useCustomizerClone: false,
                ignoreProto,
                ignoreProps,
                ignoreThisLoop,
                async
            };
        }

        ({
            additionalValues,
            ignoreProps,
            ignoreProto,
            async
        } = customResult);
        useCustomizerClone = true;

        if (customResult.ignore === true) {
            return {
                cloned,
                useCustomizerClone,
                ignoreProto,
                ignoreProps,
                ignoreThisLoop: true,
                async
            };
        }

        if (!Array.isArray(additionalValues)
            && additionalValues !== undefined) {
            throw Warning.IMPROPER_ADDITIONAL_VALUES;
        }

        if (async && !asyncMode) {
            throw Warning.CUSTOMIZER_ASYNC_IN_SYNC_MODE;
        }

        if (!asyncMode) {
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

        handleAdditionalValues({
            value,
            additionalValues,
            asyncMode,
            queue,
            pendingResults
        });
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
