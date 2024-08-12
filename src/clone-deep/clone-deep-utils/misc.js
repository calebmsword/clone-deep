import { getWarning } from '../../utils/clone-deep-warning.js';
import {
    forAllOwnProperties,
    getPrototype,
    hasAccessor
} from '../../utils/metadata.js';

/**
 * Checks the clone store to see if we the given value was already cloned.
 * This is used to avoid infinite loops on objects with circular references.
 * This may have a side effect of saving the clone to a persistent place.
 * @param {any} value
 * The value to check.
 * @param {Map<any, any>} cloneStore
 * The clone store.
 * @param {(clone: any) => any} saveClone
 * Handles saving the provided clone to a persistent place.
 * @returns {boolean}
 * Whether the store contained a clone for this value.
 */
export const checkCloneStore = (value, cloneStore, saveClone) => {
    if (cloneStore.has(value)) {
        saveClone(cloneStore.get(value));
        return true;
    }
    return false;
};

/**
 * Checks if a cloned parent object is an "instance" of the provided value.
 * We say "instance" to say that the constructor for the cloned object used the
 * value as its prototype.
 * @param {any} value
 * The value to check.
 * @param {Set<any>|undefined} registry
 * The "parent object registry" used internally by cloneDeepFully. A "parent
 * object" is a top-level object that was cloned. For example, if we have:
 *
 * ```
 * const protoChild = {};
 * const protoParent = { protoChild };
 *
 * const childObject = {};
 * const parentObject = Object.create(protoParent);
 * parent.childObject = childObject;
 *
 * const cloned = cloneDeepFully(parentObject);
 * ```
 *
 * `parentObject` and `protoParent` would be "parent objects" stored in the
 * parent object registry.
 * @returns {boolean}
 * Whether registered parent object is an instance of the given value.
 */
export const checkParentObjectRegistry = (value, registry) => {
    let ignoreCloningMethodsThisLoop = false;

    if (registry !== undefined) {
        [...registry].some((object) => {
            if (value === object?.constructor?.prototype) {
                ignoreCloningMethodsThisLoop = true;
                return true;
            }
            return false;
        });
    }

    return ignoreCloningMethodsThisLoop;
};

/**
 * If an error occurs when handling supported types, it will be handled here.
 * This will have a side effect of storing an empty object in the place where
 * a successful clone should have gone.
 * @param {unknown} error
 * The error thrown.
 * @param {import('../../types').Log} log
 * A logger.
 * @param {(clone: any) => any} saveClone
 * Handles saving the provided clone to a persistent place.
 * @returns {{ cloned: any, ignoreProto: boolean }}
 * An object containing the dummy clone value that was saved and a boolean
 * property indicating that the prototype for the dummy clone value should not
 * be checked.
 */
export const handleError = (error, log, saveClone) => {
    const msg = 'Encountered error while attempting to clone specific value. ' +
                'The value will be "cloned" into an empty object. Error ' +
                'encountered:';

    if (error instanceof Error) {
        error.message = `${msg} ${error.message}`;
        const cause = error.cause ? { cause: error.cause } : undefined;
        const stack = error.stack ? error.stack : undefined;
        log(getWarning(error.message, cause, stack));
    } else {
        log(getWarning(msg, { cause: error }));
    }

    return {
        cloned: saveClone({}),
        ignoreProto: true
    };
};

/**
 * Ensure that the cloned object shares a prototype with the original.
 * @param {any} cloned
 * The cloned object.
 * @param {any} value
 * The original object.
 */
export const ensurePrototypesMatch = (cloned, value) => {
    if (getPrototype(cloned) !== getPrototype(value)) {
        Object.setPrototypeOf(cloned, getPrototype(value));
    }
};

/**
 * Updates the synchronous queue with the properties of the given value.
 * This will use all "owned" properties of value. This includes non-enumerable
 * and symbol properties, and excludes properties from value's prototype chain.
 * @param {any} value
 * The value whose properties will be iterated over.
 * @param {any} clone
 * The clone that will inherit clones of `value`'s properties.
 * @param {(string|symbol)[]} propsToIgnore
 * A list of properties of `value` to skip.
 * @param {import('../../types').SyncQueueItem[]} syncQueue
 * The queue representing future values to clone synchronously.
 */
export const addOwnPropertiesToQueue = (value,
                                        clone,
                                        propsToIgnore,
                                        syncQueue) => {
    forAllOwnProperties(value, (key) => {
        if (propsToIgnore.includes(key)) {
            return;
        }

        const meta = Object.getOwnPropertyDescriptor(value, key);

        syncQueue.push({
            value: !hasAccessor(meta) ? value[key] : undefined,
            parentOrAssigner: clone,
            prop: key,
            metadata: meta
        });
    });
};

/**
 * Performs last-minute pruning of the cloned value.
 * This function stores the cloned value in the clone store, check that
 * prototype is the same as the original value, and adds properties of the
 * original value to the queue.
 * @param {any} value
 * @param {any} cloned
 * @param {boolean} cloneIsCached
 * @param {boolean|undefined} ignoreProto
 * @param {boolean|undefined} ignoreProps
 * @param {boolean} ignoreThisLoop
 * @param {(string|symbol)[]} propsToIgnore
 * @param {Map<any, any>} cloneStore
 * @param {import('../../types').SyncQueueItem[]} syncQueue
 */
export const finalizeClone = (value,
                              cloned,
                              cloneIsCached,
                              ignoreProto,
                              ignoreProps,
                              ignoreThisLoop,
                              propsToIgnore,
                              cloneStore,
                              syncQueue) => {
    if (cloned !== null && typeof cloned === 'object'
        && !cloneIsCached
        && !ignoreThisLoop) {
        cloneStore.set(value, cloned);

        if (!ignoreProto) {
            ensurePrototypesMatch(cloned, value);
        }

        if (!ignoreProps) {
            addOwnPropertiesToQueue(value, cloned, propsToIgnore, syncQueue);
        }
    }
};

/**
 * Ensures each clone has the correct extensibility/sealedness/frozenness.
 * @param {[any, any][]} isExtensibleSealFrozen
 */
export const handleMetadata = (isExtensibleSealFrozen) => {
    isExtensibleSealFrozen.forEach(([value, cloned]) => {
        if (!Object.isExtensible(value)) {
            Object.preventExtensions(cloned);
        }
        if (Object.isSealed(value)) {
            Object.seal(cloned);
        }
        if (Object.isFrozen(value)) {
            Object.freeze(cloned);
        }
    });
};
