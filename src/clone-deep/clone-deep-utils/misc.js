import { getError } from '../../utils/clone-deep-error.js';
import {
    forAllOwnProperties,
    getPrototype,
    hasAccessor
} from '../../utils/metadata.js';
import { castAsInstanceOf } from '../../utils/helpers.js';
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
 * @param {unknown} thrown
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
export const handleError = (thrown, log, saveClone) => {
    const msg = 'Encountered error while attempting to clone specific value. ' +
                'The value will be "cloned" into an empty object. Error ' +
                'encountered:';

    const error = castAsInstanceOf(thrown, Error);

    if (error) {
        error.message = `${msg} ${error.message}`;
        const cause = error.cause ? { cause: error.cause } : undefined;
        const stack = error.stack ? error.stack : undefined;
        log(getError(error.message, cause, stack));
    } else {
        log(getError(msg, { cause: thrown }));
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
 * The logger.
 * @param {unknown} spec.error
 * The error thrown by the customizer/cloning method.
 * @param {boolean} [spec.doThrow]
 * Whether errors thrown by customizers/cloning methods should be thrown by
 * the algorithm.
 * @param {string} spec.name
 * Either 'Customizer' or 'Cloning method'.
 * @returns {boolean}
 */
export const handleCustomError = ({
    log,
    error: thrown,
    doThrow,
    name
}) => {
    if (doThrow === true) {
        throw thrown;
    }

    const msg = `${name} encountered error. Its results will be ignored for ` +
                'the current value and the algorithm will proceed with ' +
                'default behavior. ';

    const error = castAsInstanceOf(thrown, Error);

    if (error) {
        error.message = `${msg}Error encountered: ${error.message}`;

        const cause = error.cause
            ? { cause: error.cause }
            : undefined;

        const stack = error.stack ? error.stack : undefined;
        log(getError(error.message, cause, stack));
    } else {
        log(getError(msg, { cause: error }));
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
 * The value that was cloned.
 * @param {any} spec.cloned
 * The clone of `value`.
 * @param {boolean} spec.cloneIsCached
 * Whether the clone was acquired from the clone store.
 * @param {boolean|undefined} spec.ignoreProto
 * If tre, the algorithm will not ensure that `value` and `clone` share
 * prototypes.
 * @param {boolean|undefined} spec.ignoreProps
 * If true, the algorithm will not add additional values from the properties of
 * `value` to the queue.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {boolean} spec.useCloningMethod
 * Whether cloning methods will be observed.
 * @param {Map<any, any>} spec.cloneStore
 * A store of previously cloned values, used to resolve circular references.
 * @param {import('../../types').QueueItem[]} spec.queue
 * The queue storing all values to clone.
 * @param {boolean} [spec.asyncResult]
 * Whether the clone of this value was acquired asynchronously.
 */
export const finalizeClone = ({
    value,
    cloned,
    cloneIsCached,
    ignoreProto,
    ignoreProps,
    propsToIgnore,
    cloneStore,
    queue,
    asyncResult
}) => {
    if (!isObject(cloned) || cloneIsCached || asyncResult) {
        return;
    }

    cloneStore.set(value, cloned);

    if (!ignoreProto && getPrototype(cloned) !== getPrototype(value)) {
        Object.setPrototypeOf(cloned, getPrototype(value));
    }

    if (!ignoreProps && isObject(value)) {
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
