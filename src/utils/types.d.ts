/** 
 * The type of the Tag enum-like object used to hold tags of supported types. 
 */
export type Tag = Readonly<{
    [key: string]: string,

    // "standard" classes
    ARGUMENTS: string,
    ARRAY: string,
    BIGINT: string,
    BOOLEAN: string,
    DATE: string,
    ERROR: string,
    FUNCTION: string,
    MAP: string,
    NUMBER: string,
    OBJECT: string,
    PROMISE: string,
    REGEXP: string,
    SET: string,
    STRING: string,
    SYMBOL: string,
    WEAKMAP: string,
    WEAKSET: string,

    // ArrayBuffer, DataView and TypedArrays
    ARRAYBUFFER: string,
    DATAVIEW: string,
    FLOAT32: string,
    FLOAT64: string,
    INT8: string,
    INT16: string,
    INT32: string,
    UINT8: string,
    UINT8CLAMPED: string,
    UINT16: string,
    UINT32: string,
    BIGINT64: string,
    BIGUINT64: string,

    // Web APIs
    AUDIODATA: string,
    BLOB: string,
    DOMEXCEPTION: string,
    DOMMATRIX: string,
    DOMMATRIXREADONLY: string,
    DOMPOINT: string,
    DOMPOINTREADONLY: string,
    DOMRECT: string,
    DOMRECTREADONLY: string,
    DOMQUAD: string,
    FILE: string,
    FILELIST: string,
    IMAGEDATA: string,
    VIDEOFRAME: string

    // Async Web APIs
    IMAGEBITMAP: string,
}>

/** 
 * A function which has the responsibility of assigning the clone of value.
 * These should be provided only for data that cannot be assigned to a property
 * on an object. 
 */
export type Assigner = (
    value: any,
    prop: PropertyKey | undefined,
    metadata: PropertyDescriptor | undefined
) => void;

/** Constructors of TypedArray subclasses/ */
export type TypedArrayConstructor =
    DataViewConstructor |
    Float32ArrayConstructor |
    Float64ArrayConstructor |
    Int8ArrayConstructor |
    Int16ArrayConstructor |
    Int32ArrayConstructor |
    Uint8ArrayConstructor |
    Uint8ClampedArrayConstructor |
    Uint16ArrayConstructor |
    Uint32ArrayConstructor |
    BigInt64ArrayConstructor |
    BigUint64ArrayConstructor;

/** Any error constructor that is not `AggregateErrorConstructor`. */
export type AtomicErrorConstructor = 
    ErrorConstructor | 
    EvalErrorConstructor | 
    RangeErrorConstructor | 
    ReferenceErrorConstructor | 
    SyntaxErrorConstructor | 
    TypeErrorConstructor | 
    URIErrorConstructor;

/** The type of a constructor function. */
type Constructor<T> = new (...args: any[]) => T;

export type GeometryConstructor = 
    Constructor<DOMMatrix> |
    Constructor<DOMMatrixReadOnly> |
    Constructor<DOMPoint> |
    Constructor<DOMMatrixReadOnly> |
    Constructor<DOMRect> |
    Constructor<DOMRectReadOnly>;

/**
 * TypeScript erroneously complains when you arbitrarily access properties of 
 * DOMQuad instances, even though they are objects just like any other object.
 * This extends DOMQuad so that you can access arbitrary properties.
 */
export interface DOMQuadExtended extends DOMQuad {
    [key: string]: any
}

/**
 * TypeScript erroneously complains when you arbitrarily access properties of 
 * DOMQuad instances, even though they are objects just like any other object.
 * This extends DOMPoint so that you can access arbitrary properties.
 */
export interface DOMPointExtended extends DOMPoint {
    [key: string|symbol]: any
}

/**
 * The type of elements of the `additionalValues` array property that can be
 * in a customizer result.
 */
export interface AdditionalValue {
    value: any,
    assigner: (clone: any) => void,
    async?: boolean
}

/**
 * The return value of a customizer.
 */
export interface CustomizerResult {
    clone?: any,
    additionalValues?: AdditionalValue[],
    ignore?: boolean,
    ignoreProps?: boolean,
    ignoreProto?: boolean,
    async?: boolean
}

/**
 * The return value of a cloning method.
 */
export interface CloningMethodResult<T> {
    clone: T,
    propsToIgnore?: (string|symbol)[],
    ignoreProps?: boolean,
    ignoreProto: boolean,
    async?: boolean
}
