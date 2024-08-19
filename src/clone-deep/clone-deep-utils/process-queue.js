/* eslint-disable complexity */

import { assign } from './assign.js';
import {
    checkCloneStore,
    checkParentObjectRegistry,
    finalizeClone
} from './misc.js';
import { handleCustomizer } from './handle-customizer.js';
import { handleTag } from './handle-tag.js';
import { handleCloningMethods } from './handle-cloning-method.js';
import { isObject } from '../../utils/type-checking.js';
import { getTag } from './get-tag.js';

/**
 * Iterate through all items in the queue.
 * @template U
 * @param {Object} spec
 * @param {import('../../types').QueueItem[]} spec.queue
 * The queue of values to clone.
 * @param {{ clone: U }} spec.container
 * Object containing the top-level object that will be returned by
 * cloneDeepInternal.
 * @param {import('../../types').Log} spec.log
 * The logger.
 * @param {import('../../types').Customizer} [spec.customizer]
 * The customizer used to qualify the default behavior of cloneDeepInternal.
 * @param {Map<any, any>} spec.cloneStore
 * A store of previously cloned values, used to resolve circular references.
 * @param {boolean} spec.prioritizePerformance
 * Whether or not type-checking will be more performant.
 * @param {any[]} spec.supportedPrototypes
 * A list of prototypes of the supported types available in this runtime.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods should even be considered.
 * @param {boolean} spec.doThrow
 * Whether errors in the customizer should cause the function to throw.
 * @param {Set<any>} [spec.parentObjectRegistry]
 * This is used to check if an object with a cloning method is in the prototype
 * of an object that was cloned earlier in the chain.
 * @param {[any, any][]} spec.isExtensibleSealFrozen
 * Tuples of values and their clones are added to this list. This is to ensure
 * that each clone value will have the correct
 * extensibility/sealedness/frozenness.
 * @param {import('../../types').PendingResultItem[]} [spec.pendingResults]
 * The list of all clones that can only be acquired asynchronously.
 * @param {boolean} [spec.async]
 */
export const processQueue = ({
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
    isExtensibleSealFrozen,
    pendingResults,
    async
}) => {

    for (let item = queue.shift(); item !== undefined; item = queue.shift()) {

        const {
            value,
            parentOrAssigner,
            prop,
            metadata
        } = item;

        /**
         * A shortcut for conveniently using {@link assign}.
         * @param {any} clonedValue
         * @returns {any}
         */
        const saveClone = (clonedValue) => {
            return assign({
                container,
                log,
                cloned: clonedValue,
                parentOrAssigner,
                prop,
                metadata
            });
        };

        /**
         * Will contain the cloned object.
         * @type {any}
         */
        let cloned;

        /** Whether the clone for this value has been cached in the store. */
        let cloneIsCached = false;

        /** Whether the current value should be ignored entirely. */
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

        /** Whether the provided value is a non-object. */
        const isPrimitive = !isObject(value);

        /** Is true if the provided value has a valid cloning method. */
        let useCloningMethod = false;

        /** Is true if the customizer determines the value of `cloned`. */
        let useCustomizerClone = false;

        /**
         * Is true if the clone will be resolved asynchronously.
         * @type {boolean|undefined}
         */
        let asyncResult;

        /**
         * Any properties in `value` added here will not be cloned.
         * @type {(string|symbol)[]}
         */
        const propsToIgnore = [];

        /** Whether the cloning methods should be observed this loop. */
        let ignoreCloningMethodsThisLoop = false;

        /** Identifies the type of the value. */
        const tag = getTag(value, prioritizePerformance);

        cloneIsCached = checkCloneStore(value, cloneStore, saveClone);

        if (typeof customizer === 'function') {
            ({
                cloned,
                useCustomizerClone,
                ignoreProto,
                ignoreProps,
                ignoreThisLoop,
                async: asyncResult
            } = handleCustomizer({
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
                async
            }));
        }

        if (!useCustomizerClone && isPrimitive) {
            saveClone(value);
        }

        const ignore = cloneIsCached || ignoreThisLoop || useCustomizerClone
            || isPrimitive;

        ignoreCloningMethodsThisLoop = checkParentObjectRegistry(
            value, parentObjectRegistry);
        if (!ignore && !ignoreCloningMethods && !ignoreCloningMethodsThisLoop) {
            ({
                cloned,
                ignoreProps,
                ignoreProto,
                useCloningMethod,
                async: asyncResult
            } = handleCloningMethods({
                value,
                parentOrAssigner,
                prop,
                metadata,
                ignoreCloningMethods,
                ignoreCloningMethodsThisLoop,
                propsToIgnore,
                log,
                saveClone,
                pendingResults,
                async,
                doThrow
            }));
        }

        if (!ignore && !useCloningMethod) {
            ({
                cloned,
                ignoreProps,
                ignoreProto
            } = handleTag({
                value,
                parentOrAssigner,
                prop,
                metadata,
                tag,
                prioritizePerformance,
                log,
                queue,
                isExtensibleSealFrozen,
                supportedPrototypes,
                ignoreCloningMethods,
                ignoreCloningMethodsThisLoop,
                propsToIgnore,
                saveClone,
                pendingResults,
                async
            }));
        }

        isExtensibleSealFrozen.push([value, cloned]);

        finalizeClone({
            value,
            cloned,
            cloneIsCached,
            ignoreProto,
            ignoreProps,
            ignoreThisLoop,
            useCloningMethod,
            propsToIgnore,
            cloneStore,
            queue,
            asyncResult
        });
    }
};
