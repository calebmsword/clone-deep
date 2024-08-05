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
    DOMEXCEPTION: "[object DOMException]",
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
