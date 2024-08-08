/**
 * Used to log warnings.
 */
class CloneDeepWarning extends Error {
    /**
     * @param {string} message 
     * @param {ErrorOptions} [cause] 
     * @param {string} [stack]
     */
    constructor(message, cause, stack) {
        super(message, cause);
        this.name = CloneDeepWarning.name;
        if (typeof stack === "string") this.stack = stack;
    }
}

/**
 * Creates a {@link CloneDeepWarning} instance.
 * @param {String} message The error message.
 * @param {ErrorOptions} [cause] If an object with a `cause` property, it will 
 * add a cause to the error when logged.
 * @param {string} [stack] If provided, determines the stack associated with the
 * error object.
 * @returns {CloneDeepWarning} 
 */
export function getWarning(message, cause, stack) {
    return new CloneDeepWarning(message, cause, stack);
}

/**
 * Commonly-used {@link CloneDeepWarning} instances.
 */
export const Warning = {
    WEAKMAP: getWarning("Attempted to clone unsupported type WeakMap."),
    WEAKSET: getWarning("Attempted to clone unsupported type WeakSet."),
    FUNCTION_DOT_PROTOTYPE: getWarning(
        "Attempted to clone Function.prototype. strict mode does not allow " + 
        "the caller, callee or arguments properties to be accessed so those " +
        "properties will not be cloned. Also, native methods cannot be " + 
        "cloned so all methods in Function.prototype will copied directly."),
    IMPROPER_ADDITIONAL_VALUES: getWarning(
        "The additionalValue property must be an array of objects. The " + 
        "objects must have a `value` property and an `assigner` property " + 
        "that is a function."),
    PROMISE: getWarning(
        "Attempted to clone a Promise. The cloned promise will settle when " + 
        "original Promise settles. It will fulfill or reject with the same " + 
        "value as the original Promise.")
}
