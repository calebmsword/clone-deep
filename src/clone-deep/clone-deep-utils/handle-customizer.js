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
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {import('../../types').Customizer} spec.customizer
 * The customizer used to qualify the default behavior of cloneDeepInternal.
 * The optional property descriptor for this value, if it has one.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
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
    customizer,
    globalState,
    queueItem,
    saveClone
}) => {

    const {
        log,
        queue,
        pendingResults,
        doThrow,
        async: asyncMode
    } = globalState;

    const { value } = queueItem;

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
                queueItem,
                promise: Promise.resolve(customResult.clone),
                ignoreProto,
                ignoreProps,
                propsToIgnore: []
            });
        }

        handleAdditionalValues({
            queueItem,
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
