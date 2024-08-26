import { getError } from '../../utils/clone-deep-error.js';
import { hasAccessor, isDefaultDescriptor } from '../../utils/metadata.js';

/**
 * This symbol is used to indicate that the cloned value is the top-level object
 * that will be returned by {@link cloneDeepInternal}.
 * @type {symbol}
 */
export const TOP_LEVEL = Symbol('TOP_LEVEL');

/**
 * Handles the task of assigning a cloned result using a property descriptor.
 * @template [T=any]
 * The type of the cloned value.
 * @param {Object} spec
 * @param {import('../../types').Log} spec.log
 * A logger.
 * @param {T} spec.cloned
 * The resultant cloned value.
 * @param {object} spec.parent
 * The object that will have a property assigned the cloned value.
 * @param {PropertyKey} spec.prop
 * The property of the parent object that will hold the cloned value.
 * @param {PropertyDescriptor} spec.metadata
 * The property descriptor.
 */
const handleMetadata = ({ log, cloned, parent, prop, metadata }) => {
    /** @type {PropertyDescriptor} */
    const clonedMetadata = {
        configurable: metadata.configurable,
        enumerable: metadata.enumerable
    };

    if (!hasAccessor(metadata)) {
        // `cloned` or getAccessor will determine the value
        clonedMetadata.value = cloned;

        // defineProperty throws if property with accessors is writable
        clonedMetadata.writable = metadata.writable;
    }

    if (typeof metadata.get === 'function') {
        clonedMetadata.get = metadata.get;
    }
    if (typeof metadata.set === 'function') {
        clonedMetadata.set = metadata.set;
    }

    if (hasAccessor(metadata)) {
        log.warn(getError(
            `Cloning value with name ${String(prop)} whose property ` +
            'descriptor contains a get or set accessor.'));
    }

    Object.defineProperty(parent, prop, clonedMetadata);
};

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Handles the assignment of the cloned value to some persistent place.
 * @template U
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * A logger.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {any} spec.cloned
 * The cloned value.
 * @returns {any}
 * The cloned value.
 */
export const assign = ({ globalState, queueItem, cloned }) => {

    const { container, log } = globalState;

    const { parentOrAssigner, prop, metadata } = queueItem;

    if (parentOrAssigner === TOP_LEVEL) {
        container.clone = cloned;
    } else if (typeof parentOrAssigner === 'function') {
        parentOrAssigner(cloned, prop, metadata);
    } else if (typeof parentOrAssigner === 'object'
               && (typeof prop === 'string'
                   || typeof prop === 'symbol')
               && isDefaultDescriptor(metadata)) {
        /** @type {{ [key: string|symbol|number]: any }} */
        const parent = parentOrAssigner;

        parent[prop] = cloned;
    } else if (typeof parentOrAssigner === 'object'
               && typeof prop !== 'undefined'
               && typeof metadata === 'object') {
        handleMetadata(
            { log, cloned, parent: parentOrAssigner, prop, metadata });
    }
    return cloned;
};
