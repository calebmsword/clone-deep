/* eslint-disable complexity */

import { assign } from './assign.js';
import {
    checkCloneStore,
    checkParentObjectRegistry,
    finalizeClone
} from './misc.js';
import { handleCustomizer } from './handle-customizer.js';
import { getTag, isObject } from '../../utils/type-checking.js';
import { handleTag } from './handle-tag.js';
import { handleCloningMethods } from './handle-cloning-method.js';

/**
 * Iterate through all items in the queue.
 * @template U
 * @param {Object} spec
 * @param {import('../../types.js').QueueItem[]} spec.queue
 * @param {{ clone: U }} spec.container
 * @param {import('../../types.js').Log} spec.log
 * @param {import('../../types.js').Customizer|undefined} spec.customizer
 * @param {Map<any, any>} spec.cloneStore
 * @param {boolean} spec.prioritizePerformance
 * @param {any[]} spec.supportedPrototypes
 * @param {boolean} spec.ignoreCloningMethods
 * @param {boolean} spec.doThrow
 * @param {Set<any>|undefined} spec.parentObjectRegistry
 * @param {[any, any][]} spec.isExtensibleSealFrozen
 * @param {import('../../types').AsyncResultItem[]} [spec.pendingResults]
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
                ignoreThisLoop
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
                useCloningMethod
            } = handleCloningMethods({
                value,
                ignoreCloningMethods,
                ignoreCloningMethodsThisLoop,
                propsToIgnore,
                log,
                saveClone,
                pendingResults,
                async
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
            propsToIgnore,
            cloneStore,
            queue
        });
    }
};
