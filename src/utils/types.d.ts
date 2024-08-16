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
    FILELIST: string
}>

export type Assigner = (
    value: any,
    prop: PropertyKey | undefined,
    metadata: PropertyDescriptor | undefined
) => void;

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

export type AtomicErrorConstructor = 
    ErrorConstructor | 
    EvalErrorConstructor | 
    RangeErrorConstructor | 
    ReferenceErrorConstructor | 
    SyntaxErrorConstructor | 
    TypeErrorConstructor | 
    URIErrorConstructor;

type ConstructorFor<T> = new (...args: any[]) => T;

export type GeometryConstructor = 
    ConstructorFor<DOMMatrix> |
    ConstructorFor<DOMMatrixReadOnly> |
    ConstructorFor<DOMPoint> |
    ConstructorFor<DOMMatrixReadOnly> |
    ConstructorFor<DOMRect> |
    ConstructorFor<DOMRectReadOnly>;

export interface DOMQuadExtended extends DOMQuad {
    [key: string]: any
}

export interface DOMPointExtended extends DOMPoint {
    [key: string|symbol]: any
}

export interface AdditionalValue {
    value: any,
    assigner: (clone: any) => void,
    async?: boolean
}

export interface ValueTransform {
    clone?: any,
    additionalValues?: AdditionalValue[],
    ignore?: boolean,
    ignoreProps?: boolean,
    ignoreProto?: boolean,
    async?: boolean
}

export interface CloneMethodResult<T> {
    clone: T,
    propsToIgnore?: (string|symbol)[],
    ignoreProps?: boolean,
    ignoreProto: boolean,
    async?: boolean
}
