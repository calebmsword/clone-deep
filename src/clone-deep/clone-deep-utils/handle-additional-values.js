import { Warning } from '../../utils/clone-deep-warning.js';
import { isCallable, isObject } from '../../utils/type-checking.js';

/**
 * Validates and processes any `additionalValues` from a customizer.
 * @param {Object} spec
 * @param {any} spec.value
 * @param {import('../../utils/types').AdditionalValue[]} [spec.additionalValues]
 * @param {boolean} [spec.asyncMode]
 * @param {import('../../types').QueueItem[]} spec.queue
 * @param {import('../../types').PendingResultItem[]} [spec.pendingResults]
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
