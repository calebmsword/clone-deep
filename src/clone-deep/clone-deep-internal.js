import { TOP_LEVEL } from './clone-deep-utils/assign.js';
import { handleMetadata } from './clone-deep-utils/misc.js';
import { iterateSyncQueue } from './clone-deep-utils/iterate-sync-queue.js';
import { getSupportedPrototypes } from '../utils/helpers.js';

/**
 * Clones the provided value.
 * @template T
 * See CloneDeep.
 * @template [U = T]
 * See CloneDeep.
 * @param {T} _value
 * The value to clone.
 * @param {import("../types").Customizer|undefined} customizer
 * A customizer function.
 * @param {import("../types").Log} log
 * Receives an error object for logging.
 * @param {boolean} prioritizePerformance
 * Whether or not type-checking will be more performant.
 * @param {boolean} ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} doThrow
 * Whether errors in the customizer should cause the function to throw.
 * @param {Set<any>} [parentObjectRegistry]
 * This is used by cloneDeepFully to check if an object with a cloning method is
 * in the prototype of an object that was cloned earlier in the chain.
 * @returns {U}
 */
export const cloneDeepInternal = (_value,
                                  customizer,
                                  log,
                                  prioritizePerformance,
                                  ignoreCloningMethods,
                                  doThrow,
                                  parentObjectRegistry) => {

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
     * @type {import('../types').SyncQueueItem[]}
     */
    const syncQueue = [{ value: _value, parentOrAssigner: TOP_LEVEL }];

    /**
     * We will do a second pass through everything to check Object.isExtensible,
     * Object.isSealed and Object.isFrozen. We do it last so we don't run into
     * issues where we append properties on a frozen object, etc.
     * @type {Array<[any, any]>}
     */
    const isExtensibleSealFrozen = [];

    /** An array of all prototypes of supported types in this runtime. */
    const supportedPrototypes = getSupportedPrototypes();

    while (syncQueue.length > 0) {
        iterateSyncQueue(syncQueue,
                         container,
                         log,
                         customizer,
                         cloneStore,
                         prioritizePerformance,
                         supportedPrototypes,
                         ignoreCloningMethods,
                         doThrow,
                         parentObjectRegistry,
                         isExtensibleSealFrozen);
    }

    handleMetadata(isExtensibleSealFrozen);

    return container.result;
};
