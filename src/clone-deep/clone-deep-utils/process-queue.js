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
 * @param {import('./global-state.js').GlobalState} globalState
 * The global application state.
 */
export const processQueue = (globalState) => {

    const {
        queue,
        customizer,
        cloneStore,
        isExtensibleSealFrozen,
        parentObjectRegistry,
        prioritizePerformance,
        ignoreCloningMethods
    } = globalState;

    for (let queueItem = queue.shift(); queueItem; queueItem = queue.shift()) {

        const { value } = queueItem;

        /**
         * A shortcut for conveniently using {@link assign}.
         * @param {any} clonedValue
         * @returns {any}
         */
        const saveClone = (clonedValue) => {
            return assign({
                globalState,
                queueItem: {
                    value: queueItem?.value,
                    parentOrAssigner: queueItem?.parentOrAssigner,
                    prop: queueItem?.prop,
                    metadata: queueItem?.metadata
                },
                cloned: clonedValue
            });
        };

        /**
         * Will contain the cloned object.
         * @type {any}
         */
        let cloned;

        /** Whether the clone for this value has been cached in the store. */
        let cloneIsCached = false;

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

        if (!cloneIsCached && typeof customizer === 'function') {
            ({
                cloned,
                useCustomizerClone,
                ignoreProto,
                ignoreProps,
                async: asyncResult
            } = handleCustomizer({
                customizer,
                globalState,
                queueItem,
                propsToIgnore,
                saveClone
            }));
        }

        if (!useCustomizerClone && isPrimitive) {
            saveClone(value);
        }

        const ignore = cloneIsCached || useCustomizerClone || isPrimitive;

        ignoreCloningMethodsThisLoop = checkParentObjectRegistry(
            value, parentObjectRegistry);

        if (!ignore && !ignoreCloningMethods && !ignoreCloningMethodsThisLoop) {
            const cloningMethodResult = handleCloningMethods({
                globalState,
                queueItem,
                propsToIgnore,
                saveClone
            });

            ({
                cloned,
                useCloningMethod,
                async: asyncResult
            } = cloningMethodResult);

            ignoreProps ||= cloningMethodResult.ignoreProps;
            ignoreProto ||= cloningMethodResult.ignoreProto;
        }

        if (!ignore && !useCloningMethod) {
            const handleTagResult = handleTag({
                globalState,
                queueItem,
                tag,
                propsToIgnore,
                saveClone
            });

            ({ cloned } = handleTagResult);

            ignoreProps ||= handleTagResult.ignoreProps;
            ignoreProto ||= handleTagResult.ignoreProto;
        }

        isExtensibleSealFrozen.push([value, cloned]);

        finalizeClone({
            value,
            cloneStore,
            queue,
            cloned,
            cloneIsCached,
            ignoreProto,
            ignoreProps,
            useCloningMethod,
            propsToIgnore,
            asyncResult
        });
    }
};
