/** Used to create methods for cloning objects.*/
export const CLONE = Symbol('CLONE');

/**
 * Contains the tag for various types.
 * @type {import('./types').Tag}
 */
export const Tag = Object.freeze({
    // "standard" classes
    ARGUMENTS: '[object Arguments]',
    ARRAY: '[object Array]',
    BIGINT: '[object BigInt]',
    BOOLEAN: '[object Boolean]',
    DATE: '[object Date]',
    ERROR: '[object Error]',
    FUNCTION: '[object Function]',
    MAP: '[object Map]',
    NUMBER: '[object Number]',
    OBJECT: '[object Object]',
    PROMISE: '[object Promise]',
    REGEXP: '[object RegExp]',
    SET: '[object Set]',
    STRING: '[object String]',
    SYMBOL: '[object Symbol]',
    WEAKMAP: '[object WeakMap]',
    WEAKSET: '[object WeakSet]',

    // ArrayBuffer, DataView and TypedArrays
    ARRAYBUFFER: '[object ArrayBuffer]',
    DATAVIEW: '[object DataView]',
    FLOAT32: '[object Float32Array]',
    FLOAT64: '[object Float64Array]',
    INT8: '[object Int8Array]',
    INT16: '[object Int16Array]',
    INT32: '[object Int32Array]',
    UINT8: '[object Uint8Array]',
    UINT8CLAMPED: '[object Uint8ClampedArray]',
    UINT16: '[object Uint16Array]',
    UINT32: '[object Uint32Array]',
    BIGINT64: '[object BigInt64Array]',
    BIGUINT64: '[object BigUint64Array]',

    // Web APIs
    AUDIODATA: '[object AudioData]',
    BLOB: '[object Blob]',
    DOMEXCEPTION: '[object DOMException]',
    DOMMATRIX: '[object DOMMatrix]',
    DOMMATRIXREADONLY: '[object DOMMatrixReadOnly]',
    DOMPOINT: '[object DOMPoint]',
    DOMPOINTREADONLY: '[object DOMPointReadOnly]',
    DOMRECT: '[object DOMRect]',
    DOMRECTREADONLY: '[object DOMRectReadOnly]',
    DOMQUAD: '[object DOMQuad]',
    FILE: '[object File]',
    FILELIST: '[object FileList]',
    IMAGEDATA: '[object ImageData]',
    VIDEOFRAME: '[object VideoFrame]',

    // Async Web APIs
    IMAGEBITMAP: '[object ImageBitmap]'
});

export const WebApis = Object.freeze({
    AudioData: 'AudioData',
    Blob: 'Blob',
    DOMException: 'DOMException',
    DOMMatrix: 'DOMMatrix',
    DOMMatrixReadOnly: 'DOMMatrixReadOnly',
    DOMPoint: 'DOMPoint',
    DOMPointReadOnly: 'DOMPointReadOnly',
    DOMQuad: 'DOMQuad',
    DOMRect: 'DOMRect',
    DOMRectReadOnly: 'DOMRectReadOnly',
    File: 'File',
    FileList: 'FileList',
    ImageBitmap: 'ImageBitmap',
    ImageData: 'ImageData',
    VideoFrame: 'VideoFrame'
});

export const TypeArrays = Object.freeze({
    ArrayBuffer: 'ArrayBuffer',
    DataView: 'DataView',
    Float32Array: 'Float32Array',
    Float64Array: 'Float64Array',
    Int8Array: 'Int8Array',
    Int16Array: 'Int16Array',
    Int32Array: 'Int32Array',
    Uint8Array: 'Uint8Array',
    Uint8ClampedArray: 'Uint8ClampedArray',
    Uint16Array: 'Uint16Array',
    Uint32Array: 'Uint32Array',
    BigInt64Array: 'BigInt64Array',
    BigUint64Array: 'BigUint64Array'
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
