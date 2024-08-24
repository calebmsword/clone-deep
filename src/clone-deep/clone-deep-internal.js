import { handleMetadata } from './clone-deep-utils/misc.js';
import { processQueue } from './clone-deep-utils/process-queue.js';
import {
    processPendingResults
} from './clone-deep-utils/process-pending-results.js';
import { GlobalState } from './clone-deep-utils/global-state.js';

/**
 * Clones the provided value.
 * @template T
 * See CloneDeep.
 * @template [U = T]
 * See CloneDeep.
 * @param {Object} spec
 * @param {T} spec.value
 * The value to clone.
 * @param {import('../types').Customizer|undefined} spec.customizer
 * A customizer function.
 * @param {import('../types').Log} spec.log
 * Receives an error object for logging.
 * @param {import('./clone-deep-utils/types').PerformanceConfig} [spec.performanceConfig]
 * Whether or not type-checking will be more performant.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} spec.doThrow
 * Whether errors in the customizer should cause the function to throw.
 * @param {Set<any>} [spec.parentObjectRegistry]
 * This is used by cloneDeepFully to check if an object with a cloning method is
 * in the prototype of an object that was cloned earlier in the chain.
 * @param {boolean} [spec.async]
 * Whether or not the algorithm will return the clone asynchronously.
 * @returns {U | Promise<{ clone: U }>}
 */
export const cloneDeepInternal = ({
    value,
    customizer,
    log,
    performanceConfig,
    ignoreCloningMethods,
    doThrow,
    parentObjectRegistry,
    async
}) => {

    const globalState = new GlobalState({
        value,
        log,
        customizer,
        parentObjectRegistry,
        performanceConfig,
        ignoreCloningMethods,
        doThrow,
        async
    });

    if (!async) {
        processQueue(globalState);

        handleMetadata(globalState.isExtensibleSealFrozen);

        return globalState.container.clone;
    }

    /** @returns {Promise<void>} */
    const processData = async () => {
        try {
            processQueue(globalState);

            if (globalState.pendingResults.length > 0) {
                await processPendingResults(globalState);

                return processData();
            }

            handleMetadata(globalState.isExtensibleSealFrozen);
        } catch (reason) {
            return Promise.reject(reason);
        }
    };

    return processData().then(() => {
        return globalState.container;
    });
};
