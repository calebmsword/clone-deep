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
 * @template U
 * @param {Object} spec
 * @param {import('../../types.js').QueueItem[]} spec.queue
 * @param {{ result?: U }} spec.container
 * @param {import('../../types.js').Log} spec.log
 * @param {import('../../types.js').Customizer|undefined} spec.customizer
 * @param {Map<any, any>} spec.cloneStore
 * @param {boolean} spec.prioritizePerformance
 * @param {any[]} spec.supportedPrototypes
 * @param {boolean} spec.ignoreCloningMethods
 * @param {boolean} spec.doThrow
 * @param {Set<any>|undefined} spec.parentObjectRegistry
 * @param {[any, any][]} spec.isExtensibleSealFrozen
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
    isExtensibleSealFrozen
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
                saveClone,
                doThrow
            }));
        }

        ignoreCloningMethodsThisLoop = checkParentObjectRegistry(
            value, parentObjectRegistry);

        if (!(useCustomizerClone || cloneIsCached || ignoreThisLoop)) {
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
                saveClone
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
