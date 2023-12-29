export interface QueueElement {
    value: any|Map<any, any>|Set<any>,
    parentOrAssigner?: Symbol|Object|Function,
    prop?: string | symbol,
    metadata?: PropertyDescriptor
}

export type Empty = {};

export type Customizer = (value: any) => any|void;
export type Log = (error: Error) => any;

export interface CloneDeepOptions {
    customizer: Customizer
    log?: Log,
    logMode?: string,
    letCustomizerThrow?: boolean
}

export type CloneDeepOptionsOrCustomizer = CloneDeepOptions | Customizer;
