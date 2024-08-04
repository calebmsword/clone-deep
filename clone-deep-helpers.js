/** Used to create methods for cloning objects.*/
export const CLONE = Symbol("Clone");

/**
 * Contains the tag for various types.
 * @type {Object<string, string>}
 */
export const Tag = Object.freeze({
    // "standard" classes
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

    // ArrayBuffer, DataView and TypedArrays
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
    BIGUINT64: "[object BigUint64Array]",

    // Web APIs
    BLOB: "[object Blob]",
    CRYPTOKEY: "[object CryptoKey]",
    DOMMATRIX: "[object DOMMatrix]",
    DOMMATRIXREADONLY: "[object DOMMatrixReadOnly]",
    DOMPOINT: "[object DOMPoint]",
    DOMPOINTREADONLY: "[object DOMPointReadOnly]",
    DOMRECT: "[object DOMRect]",
    DOMRECTREADONLY: "[object DOMRectReadOnly]",
    DOMQUAD: "[object DOMQuad]",
    FILE: "[object File]",
    FILELIST: "[object FileList]",
});

/** All prototypes of supported types. */
export const supportedPrototypes = Object.freeze([
    // "standard" classes
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

    // ArrayBuffer, DataView and TypedArrays
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
 * Gets the prototype of the provided object.
 * @param {any} value
 * @returns {any}
 */
function getPrototype(value) {
    return Object.getPrototypeOf(value);
}

/**
 * Retrieves the property descriptors of the provided object.
 * The result is a hash which maps properties to their property descriptor.
 * @param {any} value 
 * @returns {{ [property: string|symbol]: PropertyDescriptor }}
 */
function getDescriptors(value) {
    return Object.getOwnPropertyDescriptors(value);
}

/**
 * Determines whether a particular property is read-only.
 * @param {any} value 
 * Any object.
 * @param {string|symbol} property 
 * The property on the object whose mutability will be checked.
 * A function which modifies the value assigned to that property.
 */
export function isReadOnly(value, property) {
    try {
        const original = value[property];
        value[property] = value[property] + 1;
        const final = value[property];

        value[property] = original;
        return final !== original + 1;
    }
    catch {
        // The web specification does not determine whether an implementation 
        // should throw if reassignment of a readonly property of a web api 
        // is performed; hence we use a try-catch to catch runtimes which will 
        // throw.
        return true;
    }
}

/**
 * A factory which creates type checkers for readonly geometry (sub)classes.
 * @param {any} Class 
 * An immutable geometry subclass (DOMMatrixReadOnly, DOMRectReadOnly, etc).
 * @param {string|symbol|{ name: string|symbol }} methodOrProp 
 * If a primitive, then the name of a method on the immutable geometry subclass.
 * If an object, it should be a hash with a single property `"name"` that 
 * refers to a non-method property on the instance. 
 * @param {string|symbol} property
 * An instance property.
 * @returns {{ [method: string]: (value: any) => boolean }}
 */
function getGeometryCheckers(Class, methodOrProp, property) {

    /** @type {Map<any, boolean>} */
    const registry = new Map;
    
    const descriptors = getDescriptors(getPrototype(new Class));

    /**
     * @param {any} value 
     * @returns {boolean}
     */
    function isSubclass(value) {
        if (registry.has(value)) {
            const result = registry.get(value);
            if (typeof result === "boolean") return result;
        }

        /** @type {boolean} */
        let result;

        try {
            if (typeof methodOrProp === "object") {
                descriptors[methodOrProp.name].get?.call(value);
            }
            else {
                Class.prototype[methodOrProp].call(value);
            }
            result = true;
        }
        catch {
            result = false;
        }

        registry.set(value, result);
        return result;
    }

    /** @type {(value?: any) => boolean} */
    const isMutable = typeof methodOrProp === "object"
        ? value => !isReadOnly(value, methodOrProp.name)
        : value => !isReadOnly(value, property);


    /** @type {(value: any) => boolean} */
    function isImmutableType(value) {
        return isSubclass(value) && !isMutable(value);
    }

    /** @type {(value: any) => boolean} */
    function isMutableType(value) {
        return isSubclass(value) && isMutable(value);
    }

    const immutableClassName = Class.name;
    const mutableClassName = immutableClassName.substring(
        0, immutableClassName.length - 8);

    return {
        [`is${immutableClassName}`]: isImmutableType,
        [`is${mutableClassName}`]: isMutableType
    };
}

export const {
    isDOMMatrixReadOnly,
    isDOMMatrix
} = getGeometryCheckers(DOMMatrixReadOnly, "scale", "m11");

export const {
    isDOMPointReadOnly,
    isDOMPoint
} = getGeometryCheckers(DOMPointReadOnly, "toJSON", "x");

export const {
    isDOMRectReadOnly,
    isDOMRect
} = getGeometryCheckers(DOMRectReadOnly, { name: "x" }, "x");

/**
 * Returns `true` if the given value is a File instance, `false` otherwise.
 * @param {any} value 
 * @returns {boolean}
 */
export function isFile(value) {
    try {
        Blob.prototype.slice.call(value);
        getDescriptors(getPrototype(value)).lastModified.get?.call(value);
        return true;
    }
    catch {
        return false;
    }
}

/** 
 * Convenience array used for `getTag`.
 * @type {Array<[any, string, string, ...any]>} 
 */
const classesToTypeCheck = [
    // "standard" classes
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
    [WeakMap, "has", Tag.WEAKMAP],
    [WeakSet, "has", Tag.WEAKSET],

    // ArrayBuffer, DataView and TypedArrays
    [DataView, "getInt8", Tag.DATAVIEW],

    // Web APIs
    [Blob, "clone", Tag.BLOB],
    [DOMQuad, "toJSON", Tag.DOMQUAD],
    [FileList, "item", Tag.FILELIST, 0]
];

/**
 * Convenience array used for `getTag`.
 * Certain classes that require special handling to type check are handled here.
 * @type {Array<[(value: any) => boolean, string]>}
 */
const typeCheckers = [
    [isDOMMatrix, Tag.DOMMATRIX],
    [isDOMMatrixReadOnly, Tag.DOMMATRIXREADONLY],
    [isDOMPoint, Tag.DOMPOINT],
    [isDOMPointReadOnly, Tag.DOMPOINTREADONLY],
    [isDOMRect, Tag.DOMRECT],
    [isDOMRectReadOnly, Tag.DOMRECTREADONLY],
    [isFile, Tag.FILE]
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
 * `Object.prototype.toString.call` on classes where this is applicable (which 
 * is most classes).
 *  
 * @example
 * ```
 * const isMap = value => { 
 *     try {
 *         Map.prototype.has.call(value);
 *         return true;
 *     }
 *     catch {
 *         return false;
 *     }
 * }
 * 
 * console.log(isMap(new Map()));   // true
 * console.log(isMap(Object.create(Map.prototype)));  // false
 * console.log(isMap({ [Symbol.toStringTag]: "Map" }));  // false
 * ```
 * 
 * Some classes don't have any native instances, but instead have properties 
 * with get/set accessors. These accessors typically throw if bound to incorrect 
 * instances, so we can use a nearly equivalent technique for them.
 * 
 * Currently, only Array, CryptoKey, and TypedArray subclasses are having their 
 * tag retrieved from `Object.prototype.toString.call`. (This is not an issue 
 * for Arrays since Array.isArray is the best type check for them anyway.) All 
 * other classes are checked by binding the given value to the appropriate 
 * prototype method or accessor function. No matter which method is used, we 
 * return the tag associated with the detected class.
 * 
 * @param {any} value 
 * The value to get the tag of.
 * @returns {string} tag 
 * A string indicating the value's type.
 */
export function getTag(value) {

    /** @type {undefined|string} */
    let result;

    classesToTypeCheck.some(([Class, method, tag, ...args]) => {
        if (!(value instanceof Class)) return;
        try {
            Class.prototype[method].call(value, ...args);
            result = tag;
            return true; // stop iterating
        }
        catch {/*carry on*/}
    });

    if (result === undefined) {
        typeCheckers.some(([typeChecker, tag]) => {
            if (typeChecker(value)) {
                result = tag;
                return true; // stop iterating
            }
        });
    }

    return result || Object.prototype.toString.call(value);
}

/**
 * Gets the appropriate TypedArray constructor for the given object tag.
 * @param {string} tag
 * The tag for the object.
 * @param {import("./public-types").Log} log
 * A logging function.
 * @returns {import("./private-types").TypedArrayConstructor}
 */
export function getTypedArrayConstructor(tag, log) {
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
        default:
            log(getWarning("Unrecognized TypedArray subclass. This object " + 
                           "will be cloned into a DataView instance."));
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

const TypedArrayProto = getPrototype(getPrototype((
    new Float32Array(new ArrayBuffer(0)))));

/**
 * Returns `true` if given value is a TypedArray instance, `false` otherwise.
 * @param {string} value 
 * Any arbitrary value
 * @returns {boolean}
 */
export function isTypedArray(value) {
    try {
        TypedArrayProto.lastIndexOf.call(value);
        return true;
    }
    catch(_) {
        return false;
    }
}

/**
 * Creates a FileList.
 * See https://github.com/fisker/create-file-list.
 * @param  {...File} files 
 * @returns {FileList}
 */
export function createFileList(...files) {
    const dataTransfer = new DataTransfer;

    for (const file of files) dataTransfer.items.add(file);

    return dataTransfer.files;
}

/**
 * Returns a deep clone of the given File.
 * @param {File} file 
 * @returns {File}
 */
export function cloneFile(file) {
    return new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
    });
}
