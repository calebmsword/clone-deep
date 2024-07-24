/**
 * Contains the tag for various types.
 * @type {Object<string, string>}
 */
export const Tag = Object.freeze({
    ARGUMENTS: "[object Arguments]",
    ARRAY: "[object Array]",
    BIGINT: "[object BigInt]",
    BOOLEAN: "[object Boolean]",
    DATE: "[object Date]",
    ERROR: "[object Error]",
    FUNCTION: "[object Function]",
    MAP: "[object Map]",
    NUMBER: "[object Number]",
    OBJECT: "[object Object]",
    PROMISE: "[object Promise]",
    REGEXP: "[object RegExp]",
    SET: "[object Set]",
    STRING: "[object String]",
    SYMBOL: "[object Symbol]",
    WEAKMAP: "[object WeakMap]",
    WEAKSET: "[object WeakSet]",
    ARRAYBUFFER: "[object ArrayBuffer]",
    DATAVIEW: "[object DataView]",
    FLOAT32: "[object Float32Array]",
    FLOAT64: "[object Float64Array]",
    INT8: "[object Int8Array]",
    INT16: "[object Int16Array]",
    INT32: "[object Int32Array]",
    UINT8: "[object Uint8Array]",
    UINT8CLAMPED: "[object Uint8ClampedArray]",
    UINT16: "[object Uint16Array]",
    UINT32: "[object Uint32Array]",
    BIGINT64: "[object BigInt64Array]",
    BIGUINT64: "[object BigUint64Array]"
});

/**
 * All prototypes of supported types.
 */
export const supportedPrototypes = Object.freeze([
    Array.prototype,
    BigInt.prototype,
    Boolean.prototype,
    Date.prototype,
    Error.prototype,
    Function.prototype,
    Map.prototype,
    Number.prototype,
    Object.prototype,
    Promise.prototype,
    RegExp.prototype,
    Set.prototype,
    String.prototype,
    Symbol.prototype,
    ArrayBuffer.prototype,
    DataView.prototype,
    Float32Array.prototype,
    Float64Array.prototype,
    Int8Array.prototype,
    Int16Array.prototype,
    Int32Array.prototype,
    Uint8Array.prototype,
    Uint8ClampedArray.prototype,
    Uint16Array.prototype,
    Uint32Array.prototype,
    BigInt64Array.prototype,
    BigUint64Array.prototype
]);

/**
 * Some native prototypes have properties that cannot be accessed or reassigned.
 * All such properties are stored here.
 */
export const forbiddenProps = Object.freeze({
    [Tag.FUNCTION]: { 
        prototype: Function.prototype,
        properties: ["caller", "callee", "arguments"]
    },
    [Tag.MAP]: {
        prototype: Map.prototype,
        properties: ["size"]
    },
    [Tag.SET]: {
        prototype: Set.prototype,
        properties: ["size"]
    },
    [Tag.SYMBOL]: {
        prototype: Symbol.prototype,
        properties: ["description"]
    },
    [Tag.ARRAYBUFFER]: {
        prototype: ArrayBuffer.prototype,
        properties: ["byteLength", "maxByteLength", "resizable", "detached"]
    },
    [Tag.DATAVIEW]: {
        prototype: DataView.prototype,
        properties: ["buffer", "byteLength", "byteOffset"]
    }
});

/** 
 * Convenience array used for `getTag`.
 * @type {Array<[any, string, string]>} 
 */
const prototypes = [
    [ArrayBuffer, "slice", Tag.ARRAYBUFFER],
    [BigInt, "valueOf", Tag.BIGINT],
    [Boolean, "valueOf", Tag.BOOLEAN],
    [Date, "getUTCMilliseconds", Tag.DATE],
    [Function, "bind", Tag.FUNCTION],
    [Map, "has", Tag.MAP],
    [Number, "valueOf", Tag.NUMBER],
    [Promise, "then", Tag.PROMISE],
    [RegExp, "exec", Tag.REGEXP],
    [Set, "has", Tag.SET],
    [String, "valueOf", Tag.STRING],
    [Symbol, "valueOf", Tag.SYMBOL],
    [DataView, "getInt8", Tag.DATAVIEW]
];

/**
 * Gets a "tag", which is an string which identifies the type of a value.
 * 
 * `Object.prototype.toString` returns a string like `"[object <Type>]"`,  where 
 * `"<Type>"` is the type of the object. We refer this return value as the 
 * **tag**. Normally, the tag is determined by what `this[Symbol.toStringTag]` 
 * is, but the JavaScript specification for `Object.prototype.toString` requires 
 * that many native JavaScript objects return a specific tag if the object does 
 * not have the `Symbol.toStringTag` property. Also, classes introduced after 
 * ES6 typically have their own non-writable `Symbol.toStringTag` property. This 
 * makes `Object.prototype.toString.call` a stronger type-check that 
 * `instanceof`.
 * 
 * @example
 * ```
 * const array = new Array();
 * console.log(array instanceof Array);  // true
 * console.log(Object.prototype.toString.call(array));  // "[object Array]"
 * 
 * const arraySubclass = Object.create(Array.prototype);
 * console.log(arraySubclass instance Array);  // true;
 * console.log(Object.prototype.toString.call(arraySubclass));  // "[object Object]"
 * 
 * // Note this is not a perfect type check because we can do:
 * arraySubclass[Symbol.toStringTag] = "Array"
 * console.log(Object.prototype.toString.call(arraySubclass));  // "[object Array]"
 * ```
 * 
 * However, some native classes will throw if their prototype methods are called 
 * on an object that wasn't called with the appropriate constructor function. 
 * This can be used as a stronger type check than 
 * `Object.prototype.toString.call` on the few classes where this is applicable.
 * 
 * @example
 * ```
 * Map.isMap = value => { 
 *     try {
 *         Map.prototype.has.call(value);
 *         return true;
 *     }
 *     catch {
 *         return false;
 *     }
 * }
 * 
 * console.log(Map.isMap(new Map()));   // true
 * console.log(Map.isMap(Object.create(Map.prototype)));  // false
 * console.log(Map.isMap({ [Symbol.toStringTag]: "Map" }));  // false
 * ```
 * 
 * @param {any} value 
 * The value to get the tag of.
 * @returns {string} tag 
 * A string indicating the value's type.
 */
export function getTag(value) {

    /** @type {undefined|string} */
    let result;

    prototypes.some(([Class, method, tag]) => {
        if (!(value instanceof Class)) return;
        try {
            Class.prototype[method].call(value);
            result = tag;
            return true; // stop iterating
        }
        catch {/*carry on*/}
    });

    return result || Object.prototype.toString.call(value);
}

/**
 * Gets the appropriate TypedArray constructor for the given object tag.
 * @param {string} tag
 * The tag for the object.
 * @returns {import("./private-types").TypedArrayConstructor}
 */
export function getTypedArrayConstructor(tag) {
    switch (tag) {
        case Tag.DATAVIEW:
            return DataView;
        case Tag.FLOAT32:
            return Float32Array;
        case Tag.FLOAT64:
            return Float64Array;
        case Tag.INT8:
            return Int8Array;
        case Tag.INT16:
            return Int16Array;
        case Tag.INT32:
            return Int32Array;
        case Tag.UINT8:
            return Uint8Array;
        case Tag.UINT8CLAMPED:
            return Uint8ClampedArray;
        case Tag.UINT16:
            return Uint16Array;
        case Tag.UINT32:
            return Uint32Array;
        case Tag.BIGINT64:
            return BigInt64Array;
        case Tag.BIGUINT64:
            return BigUint64Array;

        // TypeScript notices that this function would return `undefined` if 
        // none of the previous cases are hit. However, this function is only 
        // called if `isTypedArray` is true, so this default case will never 
        // happen in practice. We include it only to keep TypeScript happy.
        default:
            return DataView;
    }
}

/**
 * Whether the provided value is iterable.
 * See https://stackoverflow.com/a/32538867/22334683.
 * @param {any} value 
 * The value whose iterability will be checked.
 * @returns {boolean}
 */
export function isIterable(value) {
    if (value === null || value === undefined ) return false;
    return typeof value[Symbol.iterator] === "function";
}

/**
 * Gets the appropriate error constructor for the error name.
 * @param {Error} value
 * The object itself. This is necessary to correctly find constructors for 
 * various Error subclasses.
 * @param {(error: Error) => any} [log]
 * An optional logging function.
 * @returns {import("./private-types.js").AtomicErrorConstructor}
 */
export function getAtomicErrorConstructor(value, log) {
    const name = value.name;
    switch (name) {
        case "Error":
            return Error;
        case "EvalError":
            return EvalError;
        case "RangeError":
            return RangeError;
        case "ReferenceError":
            return ReferenceError;
        case "SyntaxError":
            return SyntaxError;
        case "TypeError":
            return TypeError;
        case "URIError":
            return URIError;
        default:
            if (log !== undefined)
                log(getWarning("Cloning error with unrecognized name " + 
                                `${name}! It will be cloned into an ` + 
                                "ordinary Error object."))
            return Error;
    }
}

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

/**
 * Returns `true` if tag is that of a TypedArray subclass, `false` otherwise.
 * @param {string} tag A tag. See {@link tagOf}.
 * @returns {boolean}
 */
export function isTypedArray(tag) {
    return [   
        Tag.DATAVIEW, 
        Tag.FLOAT32,
        Tag.FLOAT64,
        Tag.INT8,
        Tag.INT16,
        Tag.INT32,
        Tag.UINT8,
        Tag.UINT8CLAMPED,
        Tag.UINT16,
        Tag.UINT32,
        Tag.BIGINT64,
        Tag.BIGUINT64
    ].includes(tag);
}

/** Used to create methods for cloning objects.*/
export const CLONE = Symbol("Clone");
