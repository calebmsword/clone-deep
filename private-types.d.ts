export type assigner = (
    value: any,
    prop: PropertyKey | undefined,
    metadata: PropertyDescriptor | undefined
) => void;

export type Assign<T> = (
    value: T,
    parentOrAssigner: assigner | symbol | Object | undefined,
    prop: PropertyKey | undefined,
    metadata: PropertyDescriptor | undefined
) => T

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
