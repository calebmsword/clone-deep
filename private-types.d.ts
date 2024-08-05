export type assigner = (
    value: any,
    prop: PropertyKey | undefined,
    metadata: PropertyDescriptor | undefined
) => void;

export interface QueueElement {
    value: any,
    parentOrAssigner?: symbol|Object|assigner,
    prop?: string | symbol,
    metadata?: PropertyDescriptor
}

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
