import { getWarning } from '../../utils/clone-deep-warning.js';
import {
    forAllOwnProperties,
    getPrototype,
    hasAccessor
} from '../../utils/metadata.js';
import { isObject } from '../../utils/type-checking.js';

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
 * Error handler used for customizers or cloning methods.
 * This method always returns the value `false`, in case you would like to flag
 * that an error was thrown.
 * @param {Object} spec
 * @param {import('../../types').Log} spec.log
 * @param {unknown} spec.error
 * @param {boolean} [spec.doThrow]
 * @param {string} spec.name
 * @returns {boolean}
 */
export const handleCustomError = ({
    log,
    error,
    doThrow,
    name
}) => {
    if (doThrow === true) {
        throw error;
    }

    const msg = `${name} encountered error. Its results will be ignored for ` +
                'the current value and the algorithm will proceed with ' +
                'default behavior. ';

    if (error instanceof Error) {
        error.message = `${msg}Error encountered: ${error.message}`;

        const cause = error.cause
            ? { cause: error.cause }
            : undefined;

        const stack = error.stack ? error.stack : undefined;
        log(getWarning(error.message, cause, stack));
    } else {
        log(getWarning(msg, { cause: error }));
    }

    return false;
};

/**
 * Performs last-minute pruning of the cloned value.
 * This function stores the cloned value in the clone store, check that
 * prototype is the same as the original value, and adds properties of the
 * original value to the queue.
 * @param {Object} spec
 * @param {any} spec.value
 * @param {any} spec.cloned
 * @param {boolean} spec.cloneIsCached
 * @param {boolean|undefined} spec.ignoreProto
 * @param {boolean|undefined} spec.ignoreProps
 * @param {boolean} spec.ignoreThisLoop
 * @param {(string|symbol)[]} spec.propsToIgnore
 * @param {boolean} spec.useCustomizerClone
 * @param {boolean} spec.useCloningMethod
 * @param {Map<any, any>} spec.cloneStore
 * @param {import('../../types').QueueItem[]} spec.queue
 * @param {boolean} [spec.asyncResult]
 */
export const finalizeClone = ({
    value,
    cloned,
    cloneIsCached,
    ignoreProto,
    ignoreProps,
    ignoreThisLoop,
    propsToIgnore,
    cloneStore,
    queue,
    asyncResult
}) => {
    if (!isObject(cloned) || cloneIsCached || ignoreThisLoop || asyncResult) {
        return;
    }

    cloneStore.set(value, cloned);

    if (!ignoreProto && getPrototype(cloned) !== getPrototype(value)) {
        Object.setPrototypeOf(cloned, getPrototype(value));
    }

    if (!ignoreProps) {
        forAllOwnProperties(value, (key) => {
            if (propsToIgnore.includes(key)) {
                return;
            }

            const meta = Object.getOwnPropertyDescriptor(value, key);
            queue.push({
                value: !hasAccessor(meta) ? value[key] : undefined,
                parentOrAssigner: cloned,
                prop: key,
                metadata: meta
            });
        });
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
