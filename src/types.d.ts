import { Assigner, ValueTransform } from "./utils/types";

export type Customizer = (value: any) => ValueTransform|void;

export type Log = (error: Error) => any;

export interface CloneDeepOptions {
    customizer?: Customizer
    log?: Log
    prioritizePerformance?: boolean
    ignoreCloningMethods?: boolean
    logMode?: string
    letCustomizerThrow?: boolean
}

export interface CloneDeepFullyOptions extends CloneDeepOptions {
    force?: boolean
}

export interface QueueItem {
    value: any,
    parentOrAssigner?: symbol|Object|Assigner,
    prop?: string | symbol,
    metadata?: PropertyDescriptor
}

export interface AsyncResultItem {
    value: any,
    parentOrAssigner?: symbol|Object|Assigner,
    prop?: string | symbol,
    metadata?: PropertyDescriptor,
    promise: Promise<any>,
    cloneIsCached: boolean,
    ignoreProto: boolean,
    ignoreProps: boolean,
    ignoreThisLoop: boolean,
    propsToIgnore: (string|symbol)[],
    cloneStore: Map<any, any>
}
