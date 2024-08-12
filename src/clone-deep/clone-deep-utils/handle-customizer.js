import { getWarning, Warning } from '../../utils/clone-deep-warning.js';

/**
 * Processes the return value from the provided customizer.
 * This may have the side effect of saving the cloned value to some persistent
 * place, as well as pushing more elements in the appropriate queue if
 * necessary. Errors from the customizers are also handled here.
 * @param {Object} spec
 * @param {import('../../types').Log} spec.log
 * @param {import('../../types').SyncQueueItem[]} spec.syncQueue
 * @param {import('../../types').Customizer} spec.customizer
 * @param {any} spec.value
 * @param {(clone: any) => any} spec.saveClone
 * @param {boolean} spec.doThrow
 * @returns {{
 *     cloned: any,
 *     useCustomizerClone: boolean,
 *     ignoreProto: boolean|undefined,
 *     ignoreProps: boolean|undefined,
 *     ignoreThisLoop: boolean
 * }}
 */
export const handleCustomizer = (
    { log, syncQueue, customizer, value, saveClone, doThrow }) => {

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

    try {
        const customResult = customizer(value);

        if (typeof customResult === 'object') {
            useCustomizerClone = true;

            ({
                additionalValues,
                ignoreProps,
                ignoreProto
            } = customResult);

            if (customResult.ignore === true) {
                ignoreThisLoop = true;
            } else {
                cloned = saveClone(customResult.clone);

                if (Array.isArray(additionalValues)) {
                    additionalValues.forEach((object) => {
                        if (typeof object === 'object'
                            && typeof object.assigner === 'function') {
                            syncQueue.push({
                                value: object.value,
                                parentOrAssigner: object.assigner
                            });
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
        if (doThrow === true) {
            throw error;
        }

        useCustomizerClone = false;

        const msg = 'customizer encountered error. Its results will ' +
                    'be ignored for the current value and the ' +
                    'algorithm will proceed with default behavior. ';

        if (error instanceof Error) {
            error.message = `${msg}Error encountered: ${error.message}`;

            const cause = error.cause
                ? { cause: error.cause }
                : undefined;

            const stack = error.stack ? error.stack : undefined;
            log(getWarning(error.message, cause, stack));
        } else {
            log(getWarning(msg, { cause: error }));
        }
    }

    return {
        cloned,
        useCustomizerClone,
        ignoreProto,
        ignoreProps,
        ignoreThisLoop
    };
};
