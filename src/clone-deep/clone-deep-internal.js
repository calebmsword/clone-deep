import { TOP_LEVEL } from './clone-deep-utils/assign.js';
import { handleMetadata } from './clone-deep-utils/misc.js';
import { processQueue } from './clone-deep-utils/process-queue.js';
import { getSupportedPrototypes } from '../utils/helpers.js';

/**
 * Clones the provided value.
 * @template T
 * See CloneDeep.
 * @template [U = T | Promise<{ result: T }>]
 * See CloneDeep.
 * @param {Object} spec
 * @param {T} spec.value
 * The value to clone.
 * @param {import('../types').Customizer|undefined} spec.customizer
 * A customizer function.
 * @param {import('../types').Log} spec.log
 * Receives an error object for logging.
 * @param {boolean} spec.prioritizePerformance
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
 * @returns {U | Promise<{ result: U }>}
 */
export const cloneDeepInternal = ({
    value,
    customizer,
    log,
    prioritizePerformance,
    ignoreCloningMethods,
    doThrow,
    parentObjectRegistry,
    async = false
}) => {

    /**
     * Contains the cloned value.
     * @type {{ result: any }}
     */
    const container = { result: undefined };

    /**
     * Will be used to store cloned values so that we don't loop infinitely on
     * circular references.
     */
    const cloneStore = new Map();

    /**
     * A queue so we can avoid recursion.
     * @type {import('../types').QueueItem[]}
     */
    const queue = [{ value, parentOrAssigner: TOP_LEVEL }];

    /** @type {import('../types').AsyncCloneItem[]} */
    const asyncClones = [];

    /**
     * We will do a second pass through everything to check Object.isExtensible,
     * Object.isSealed and Object.isFrozen. We do it last so we don't run into
     * issues where we append properties on a frozen object, etc.
     * @type {Array<[any, any]>}
     */
    const isExtensibleSealFrozen = [];

    /** An array of all prototypes of supported types in this runtime. */
    const supportedPrototypes = getSupportedPrototypes();

    if (!async) {
        processQueue({
            queue,
            container,
            log,
            customizer,
            cloneStore,
            prioritizePerformance,
            supportedPrototypes,
            ignoreCloningMethods,
            doThrow,
            parentObjectRegistry,
            isExtensibleSealFrozen
        });

        handleMetadata(isExtensibleSealFrozen);

        return container.result;
    }

    return (
        /**
         * @returns {Promise<{ result: U }>}
         */
        async function iterateData() {
            try {
                processQueue({
                    queue,
                    container,
                    log,
                    customizer,
                    cloneStore,
                    prioritizePerformance,
                    supportedPrototypes,
                    ignoreCloningMethods,
                    doThrow,
                    parentObjectRegistry,
                    isExtensibleSealFrozen
                });

                if (asyncClones.length > 0) {
                    const clones = await Promise.allSettled(asyncClones);
                    clones.forEach((clone) => {
                        console.log(clone);
                        // if rejected, log the error

                        // if
                    });

                    asyncClones.length = 0;

                    return iterateData();
                }

                handleMetadata(isExtensibleSealFrozen);
                return container;
            } catch (reason) {
                return Promise.reject(reason);
            }
        }());
};
