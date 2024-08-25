/**
 * Used to log warnings.
 */
class CloneDeepError extends Error {
    /**
     * @param {string} message
     * @param {ErrorOptions} [cause]
     * @param {string} [stack]
     */
    constructor(message, cause, stack) {
        super(message, cause);
        this.name = CloneDeepError.name;
        if (typeof stack === 'string') {
            Object.defineProperty(this, 'stack', {
                value: stack
            });
        }
    }
}

/**
 * Creates a {@link CloneDeepError} instance.
 * @param {String} message The error message.
 * @param {ErrorOptions} [cause] If an object with a `cause` property, it will
 * add a cause to the error when logged.
 * @param {string} [stack] If provided, determines the stack associated with the
 * error object.
 * @returns {CloneDeepError}
 */
export const getError = (message, cause, stack) => {
    return new CloneDeepError(message, cause, stack);
};

/**
 * Commonly-used {@link CloneDeepError} instances.
 */
export const CloneError = {
    WEAKMAP: getError('Attempted to clone unsupported type WeakMap.'),
    WEAKSET: getError('Attempted to clone unsupported type WeakSet.'),
    IMPROPER_ADDITIONAL_VALUES: getError(
        'The additionalValue property must be an array of objects. The ' +
        'objects must have a `value` property and an `assigner` property ' +
        'that is a function.'),
    CUSTOMIZER_ASYNC_IN_SYNC_MODE: getError(
        'Customizer attempted to asynchronously get the clone for an object, ' +
        'but cloneDeep was not run in async mode.'),
    ADDITIONAL_VALUES_ASYNC_IN_SYNC_MODE: getError(
        'Customizer attempted to add additional values asynchronously, but ' +
        'cloneDeep was not run in async mode.'),
    CUSTOMIZER_IMPROPER_PROPS_TO_IGNORE: getError(
        'return value of customizer is an object whose propsToIgnore ' +
        'property, if not undefined, is expected to be an array of strings ' +
        'or symbols. The given result is not this type of array so it will ' +
        'have no effect.'),
    CLONING_METHOD_ASYNC_IN_SYNC_MODE: getError(
        'Cloning method attempted to asynchronously get the clone for an ' +
        'object, but cloneDeep was not run in async mode.'),
    CLONING_METHOD_IMPROPER_PROPS_TO_IGNORE: getError(
        'return value of CLONE method is an object whose propsToIgnore ' +
        'property, if not undefined, is expected to be an array of strings ' +
        'or symbols. The given result is not this type of array so it will ' +
        'have no effect.'),
    UNSUPPORTED_TYPE: getError('Attempted to clone unsupported type.'),
    IMPROPER_AGGREGATE_ERRORS: getError(
        'Cloning AggregateError with non-iterable errors property. It will ' +
        'be cloned into an AggregateError instance with an empty aggregation.'),
    FILELIST_DISALLOWED: getError('Cannot create FileList in this runtime.'),
    UNRECOGNIZED_TYPEARRAY_SUBCLASS: getError(
        'Unrecognized TypedArray subclass. This object will be cloned into a ' +
        'DataView instance.')
};

/** @type {import('../types').Log} */
export const defaultLog = {
    warn(error) {
        console.warn(typeof error === 'object' ? error.message : error);
    },
    error(error) {
        console.error(error);
    }
};
