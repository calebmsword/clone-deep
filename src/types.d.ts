import { Assigner, CustomizerResult } from "./utils/types";

/** A function that can alter the default behavior of `cloneDeep`. */
export type Customizer = (
    value: any,
    log?: Log
) => CustomizerResult|void;

/** The type of a logger. */
export type Log = (error: Error) => any;

/** The configuration object used by cloneDeep and cloneDeepAsync. */
export interface CloneDeepOptions {
    customizer?: Customizer
    log?: Log
    prioritizePerformance?: boolean
    ignoreCloningMethods?: boolean
    logMode?: string
    letCustomizerThrow?: boolean
    async?: boolean
}

/** The configuration object which is used by cloneDeepProxy. */
export interface CloneDeepProxyOptions extends CloneDeepOptions {
    async?: boolean
}

/** The configuration object used by cloneDeepFully and cloneDeepFullyAsync. */
export interface CloneDeepFullyOptions extends CloneDeepOptions {
    force?: boolean
}

/** The configuration object which is used by cloneDeepFullyProxy. */
export interface CloneDeepFullyProxyOptions extends CloneDeepFullyOptions {
    async?: boolean
}

/** The type of elements in the queue. */
export interface QueueItem {
    value?: any,
    parentOrAssigner?: symbol|Object|Assigner,
    prop?: string | symbol,
    metadata?: PropertyDescriptor
}

/** The type of elements in the PendingResults array. */
export interface PendingResultItem {
    queueItem: QueueItem,
    promise: Promise<any>,
    ignoreProto?: boolean,
    ignoreProps?: boolean,
    propsToIgnore: (string|symbol)[]
}
