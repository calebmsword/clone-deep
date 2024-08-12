import { getWarning } from '../../utils/clone-deep-warning.js';
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
 * The type of th cloned value.
 * @param {import("../../types.js").Log} log
 * A logger.
 * @param {T} cloned
 * The resultant cloned value.
 * @param {object} parent
 * The object that will have a property assigned the cloned value.
 * @param {PropertyKey} prop
 * The property of the parent object that will hold the cloned value.
 * @param {PropertyDescriptor} metadata
 * The property descriptor.
 */
const handleMetadata = (log, cloned, parent, prop, metadata) => {
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
        log(getWarning(
            `Cloning value with name ${String(prop)} whose property ` +
            'descriptor contains a get or set accessor.'));
    }

    Object.defineProperty(parent, prop, clonedMetadata);
};

/** @typedef {import("../../utils/types.js").Assigner} Assigner */

/**
 * Handles the assignment of the cloned value to some persistent place.
 * @param {{ result: any }} container
 * Object containing the top-level object that will be returned by
 * cloneDeepInternal.
 * @param {import("../../types.js").Log} log
 * A logger.
 * @param {any} cloned
 * The cloned value.
 * @param {Assigner|symbol|object} [parentOrAssigner]
 * Either the parent object that the cloned value will be assigned to, or a
 * function which assigns the value itself. If equal to `TOP_LEVEL`, then it
 * is the value that will be returned by the algorithm.
 * @param {PropertyKey} [prop]
 * If `parentOrAssigner` is a parent object, then `parentOrAssigner[prop]`
 * will be assigned `cloned`.
 * @param {PropertyDescriptor} [metadata]
 * The property descriptor for the object. If not an object, then this is
 * ignored.
 * @returns {any}
 * The cloned value.
 */
export const assign = (container,
                       log,
                       cloned,
                       parentOrAssigner,
                       prop,
                       metadata) => {
    if (parentOrAssigner === TOP_LEVEL) {
        container.result = cloned;
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
        handleMetadata(log, cloned, parentOrAssigner, prop, metadata);
    }
    return cloned;
};
