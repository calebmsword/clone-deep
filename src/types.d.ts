import { Assigner, CustomizerResult } from "./utils/types";

/** A function that can alter the default behavior of `cloneDeep`. */
export type Customizer = (value: any) => CustomizerResult|void;

/** The type of a logger. */
export type Log = (error: Error) => any;

/**
 * The configuration object which can be optionally provided to cloneDeep.
 */
export interface CloneDeepOptions {
    customizer?: Customizer
    log?: Log
    prioritizePerformance?: boolean
    ignoreCloningMethods?: boolean
    logMode?: string
    letCustomizerThrow?: boolean
    async?: boolean
}

/**
 * The configuration object which can be optionally provided to cloneDeepFully.
 */
export interface CloneDeepFullyOptions extends CloneDeepOptions {
    force?: boolean
}

/**
 * The type of elements in the queue.
 */
export interface QueueItem {
    value: any,
    parentOrAssigner?: symbol|Object|Assigner,
    prop?: string | symbol,
    metadata?: PropertyDescriptor
}

/**
 * The type of elements in the PendingResults array.
 */
export interface PendingResultItem {
    value: any,
    parentOrAssigner?: symbol|Object|Assigner,
    prop?: string | symbol,
    metadata?: PropertyDescriptor,
    promise: Promise<any>,
    ignoreProto?: boolean,
    ignoreProps?: boolean,
    propsToIgnore: (string|symbol)[]
}
