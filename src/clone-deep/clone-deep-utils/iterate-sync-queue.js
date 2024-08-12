import { assign } from './assign.js';
import {
    checkCloneStore,
    checkParentObjectRegistry,
    finalizeClone
} from './misc.js';
import { handleCustomizer } from './handle-customizer.js';
import { getTag } from '../../utils/type-checking.js';
import { handleTag } from './handle-tag.js';

/**
 * Iterate through all items in the sync queue.
 * @param {import('../../types').SyncQueueItem[]} syncQueue
 * @param {{ result: any }} container
 * @param {import('../../types').Log} log
 * @param {import('../../types').Customizer|undefined} customizer
 * @param {Map<any, any>} cloneStore
 * @param {boolean} prioritizePerformance
 * @param {any[]} supportedPrototypes
 * @param {boolean} ignoreCloningMethods
 * @param {boolean} doThrow
 * @param {Set<any>|undefined} parentObjectRegistry
 * @param {[any, any][]} isExtensibleSealFrozen
 */
export const iterateSyncQueue = (syncQueue,
                                 container,
                                 log,
                                 customizer,
                                 cloneStore,
                                 prioritizePerformance,
                                 supportedPrototypes,
                                 ignoreCloningMethods,
                                 doThrow,
                                 parentObjectRegistry,
                                 isExtensibleSealFrozen) => {
    const item = syncQueue.shift();

    const value = item?.value;
    const parentOrAssigner = item?.parentOrAssigner;
    const prop = item?.prop;
    const metadata = item?.metadata;

    /**
     * A shortcut for conveniently using {@link assign}.
     * @param {any} clonedValue
     * @returns {any}
     */
    const saveClone = (clonedValue) => {
        return assign(container,
                      log,
                      clonedValue,
                      parentOrAssigner,
                      prop,
                      metadata);
    };

    /**
     * Will contain the cloned object.
     * @type {any}
     */
    let cloned;

    /**
     * Whether the clone for this value has been cached in the clone store.
     * @type {boolean}
     */
    let cloneIsCached = false;

    /**
     * Whether the current value should be ignored entirely.
     * @type {boolean}
     */
    let ignoreThisLoop = false;

    /**
     * If true, do not not clone the properties of value.
     * @type {boolean|undefined}
     */
    let ignoreProps = false;

    /**
     * If true, do not have `cloned` share the prototype of `value`.
     * @type {boolean|undefined}
     */
    let ignoreProto = false;

    /**
     * Is true if the customizer determines the value of `cloned`.
     * @type {boolean}
     */
    let useCustomizerClone = false;

    /**
     * Any properties in `value` added here will not be cloned.
     * @type {(string|symbol)[]}
     */
    const propsToIgnore = [];

    /**
     * Whether the cloning methods should be observed this loop.
     * @type {boolean}
     */
    let ignoreCloningMethodsThisLoop = false;

    /**
     * Identifies the type of the value.
     * @type {string}
     */
    const tag = getTag(value, prioritizePerformance);

    cloneIsCached = checkCloneStore(value, cloneStore, saveClone);

    if (customizer !== Function.prototype && typeof customizer === 'function') {
        ({
            cloned,
            useCustomizerClone,
            ignoreProto,
            ignoreProps,
            ignoreThisLoop
        } = handleCustomizer(log,
                             syncQueue,
                             customizer,
                             value,
                             saveClone,
                             doThrow));
    }

    ignoreCloningMethodsThisLoop = checkParentObjectRegistry(
        value, parentObjectRegistry);

    if (!(useCustomizerClone || cloneIsCached || ignoreThisLoop)) {
        ({
            cloned,
            ignoreProps,
            ignoreProto
        } = handleTag(value,
                      parentOrAssigner,
                      prop,
                      tag,
                      prioritizePerformance,
                      log,
                      syncQueue,
                      isExtensibleSealFrozen,
                      supportedPrototypes,
                      ignoreCloningMethods,
                      ignoreCloningMethodsThisLoop,
                      propsToIgnore,
                      saveClone
        ));
    }

    isExtensibleSealFrozen.push([value, cloned]);

    finalizeClone(value,
                  cloned,
                  cloneIsCached,
                  ignoreProto,
                  ignoreProps,
                  ignoreThisLoop,
                  propsToIgnore,
                  cloneStore,
                  syncQueue);
};
