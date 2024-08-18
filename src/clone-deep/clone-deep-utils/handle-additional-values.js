import { Warning } from '../../utils/clone-deep-warning.js';
import { isCallable, isObject } from '../../utils/type-checking.js';

/**
 * Validates and processes any `additionalValues` from a customizer.
 * @param {Object} spec
 * @param {any} spec.value
 * The value being cloned.
 * @param {import('../../utils/types').AdditionalValue[]} [spec.additionalValues]
 * Data associated with value that also will be cloned. This should only
 * represent data that is inaccessible via property access (like, for example,
 * the data in a Set or Map).
 * @param {boolean} [spec.asyncMode]
 * Whether the algorithm is run in async mode.
 * @param {import('../../types').QueueItem[]} spec.queue
 * The queue storing all values to clone.
 * @param {import('../../types').PendingResultItem[]} [spec.pendingResults]
 * The list of all clones that can only be acquired asynchronously.
 */
export const handleAdditionalValues = ({
    value,
    additionalValues,
    asyncMode,
    queue,
    pendingResults
}) => {
    additionalValues?.forEach((additionalValueConfig) => {
        const {
            value: additionalValue,
            assigner,
            async
        } = additionalValueConfig;

        if (!isObject(additionalValueConfig) || !isCallable(assigner)) {
            throw Warning.IMPROPER_ADDITIONAL_VALUES;
        }

        if (async && !asyncMode) {
            throw Warning.ADDITIONAL_VALUES_ASYNC_IN_SYNC_MODE;
        }

        if (async) {
            pendingResults?.push({
                value,
                promise: Promise.resolve(additionalValue),
                parentOrAssigner: assigner,
                propsToIgnore: []
            });
        } else {
            queue.push({
                value: additionalValueConfig.value,
                parentOrAssigner: additionalValueConfig.assigner
            });
        }
    });
};
