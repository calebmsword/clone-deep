import { CloneError } from '../../utils/clone-deep-error.js';
import { isPropertyKeyArray } from '../../utils/type-checking.js';
import { handleAdditionalValues } from './handle-additional-values.js';
import { handleCustomError } from './misc.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Processes the return value from the provided customizer.
 * This may have the side effect of saving the cloned value to some persistent
 * place, as well as pushing more elements in the appropriate queue if
 * necessary. Errors from the customizers are also handled here.
 * @param {Object} spec
 * @param {import('../../types').Customizer} spec.customizer
 * The customizer used to qualify the default behavior of cloneDeepInternal.
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * An array of properties of the given value that will not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     useCustomizerClone: boolean,
 *     ignoreProto: boolean|undefined,
 *     ignoreProps: boolean|undefined,
 *     async?: boolean
 * }}
 */
export const handleCustomizer = ({
    customizer,
    globalState,
    queueItem,
    propsToIgnore,
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

    /** @type {boolean|undefined} */
    let async;

    /** @type {Error|undefined} */
    let throwWith;

    let forceThrow = false;

    try {
        const customResult = customizer(value, log);

        if (typeof customResult !== 'object') {
            return {
                cloned,
                useCustomizerClone: false,
                ignoreProto,
                ignoreProps,
                async
            };
        }

        ({
            additionalValues,
            ignoreProps,
            ignoreProto,
            async,
            throwWith
        } = customResult);

        if (throwWith !== undefined) {
            forceThrow = true;
            throw throwWith;
        }

        useCustomizerClone =
            typeof customResult.useCustomizerClone === 'boolean'
                ? customResult.useCustomizerClone
                : true;

        if (!Array.isArray(additionalValues)
            && additionalValues !== undefined) {
            throw CloneError.IMPROPER_ADDITIONAL_VALUES;
        }

        if (async && !asyncMode) {
            throw CloneError.CUSTOMIZER_ASYNC_IN_SYNC_MODE;
        }

        if (customResult.propsToIgnore !== undefined
            && !isPropertyKeyArray(customResult.propsToIgnore)) {
            throw CloneError.CUSTOMIZER_IMPROPER_PROPS_TO_IGNORE;
        }

        if (Array.isArray(customResult.propsToIgnore)
            && isPropertyKeyArray(customResult.propsToIgnore)) {
            propsToIgnore.push(...customResult.propsToIgnore);
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
            doThrow: doThrow || forceThrow,
            name: 'Customizer'
        });
    }

    return {
        cloned,
        useCustomizerClone,
        ignoreProto,
        ignoreProps,
        async
    };
};
