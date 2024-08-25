/**
 * The type of elements of the `additionalValues` array property that can be
 * in a customizer result.
 */
interface AdditionalValue {
    value: any,
    assigner: (clone: any) => void,
    async?: boolean
}

interface ResultBase {
    clone: any,
    propsToIgnore?: (string|symbol)[],
    ignoreProps?: boolean,
    ignoreProto: boolean,
    async?: boolean,
    throwWith?: Error
}

/**
 * The return value of a cloning method.
 */
interface CloningMethodResult extends ResultBase {
    useCloningMethod?: boolean,
}

/**
 * The return value of a customizer.
 */
interface CustomizerResult extends ResultBase {
    useCustomizerClone?: boolean
    additionalValues?: AdditionalValue[]
}

interface PerformanceConfig {
    ignoreMetadata?: boolean,
    robustTypeChecking?: boolean
}

/** A function that can alter the default behavior of `cloneDeep`. */
type Customizer = (
    value: any,
    log?: Log
) => CustomizerResult|void;

/** The type of the log object. */
type Logger = (error: Error|string) => void;

interface Log {
    info: Logger,
    warn: Logger,
    error: Logger
}

/** The configuration object used by cloneDeep and cloneDeepAsync. */
interface CloneDeepOptions {
    customizer?: Customizer
    log?: Log
    performanceConfig?: PerformanceConfig
    ignoreCloningMethods?: boolean
    logMode?: string
    letCustomizerThrow?: boolean
}

/** The configuration object used by cloneDeepFully and cloneDeepFullyAsync. */
interface CloneDeepFullyOptions extends CloneDeepOptions {
    force?: boolean
}

declare module "cms-clone-deep" {

    /**
     * Create a deep copy of the provided value.
     * The cloned object will point to the *same prototype* as the original.
     * 
     * @template T
     * The type of the input value.
     * @template [U = T]
     * The type of the return value. By default, it is the same as the input
     * value. Strictly speaking, the return value can be distinct from the input
     * if an unsupported type is provided or if a customizer or cloning method
     * radically affects the behavior of the algorithm. Use this type variable
     * if you know what you are doing.
     * 
     * @param {T} value The value to deeply copy.
     * @param {object} [options] 
     * If an object, this argument is used as a configuration object.
     * @param {Customizer} options.customizer 
     * Allows the user to inject custom logic. The function is given the value
     * to copy. If the function returns an object, the value of the `clone`
     * property on that object will be used as the clone.
     * @param {Log} options.log 
     * Any errors which occur during the algorithm can optionally be passed to a
     * log function. `log` should take one argument which will be the error
     * encountered. Use this to the log the error to a custom logger.
     * @param {string} options.logMode 
     * Case-insensitive. If "silent", no warnings will be logged. Use with
     * caution, as failures to perform true clones are logged as warnings.
     * @param {boolean} options.prioritizePerformance 
     * Normally, the algorithm uses many mechanisms to robustly determine
     * whether objects were created by native class constructors. However, this
     * has some effect on performance. Setting this property to `true` will make
     * the type-checking slightly less robust for the sake of speed.
     * @param {boolean} options.ignoreCloningMethods 
     * If true, cloning methods asociated with an object will not be used to
     * clone the object.
     * @param {boolean} options.letCustomizerThrow 
     * If `true`, errors thrown by the customizer or a cloning method will be
     * thrown by `cloneDeep`. By default, the error is logged and the algorithm
     * proceeds with default behavior.
     * @returns {U} 
     * The deep copy.
     */
    export default function cloneDeep<T, U = T>(
        value: T, 
        options: CloneDeepOptions|Customizer|undefined
    ) : U;

    /**
     * Creates promise that resolves with the deep copy of the provided value.
     * The cloned object will point to the *same prototype* as the original.
     * 
     * @example
     * ```
     * import { cloneDeepAsync } from 'cms-clone-deep';
     * 
     * const { clone } = await cloneDeepAsync(value);
     * ```
     * 
     * @template T
     * The type of the input value.
     * @template [U = T]
     * The type of the return value. By default, it is the same as the input
     * value. Strictly speaking, the return value can be distinct from the input
     * if an unsupported type is provided or if a customizer or cloning method
     * radically affects the behavior of the algorithm. Use this type variable
     * if you know what you are doing.
     * 
     * @param {T} value The value to deeply copy.
     * @param {object} [options] 
     * If an object, this argument is used as a configuration object.
     * @param {Customizer} options.customizer 
     * Allows the user to inject custom logic. The function is given the value
     * to copy. If the function returns an object, the value of the `clone`
     * property on that object will be used as the clone.
     * @param {Log} options.log 
     * Any errors which occur during the algorithm can optionally be passed to a
     * log function. `log` should take one argument which will be the error
     * encountered. Use this to the log the error to a custom logger.
     * @param {string} options.logMode 
     * Case-insensitive. If "silent", no warnings will be logged. Use with
     * caution, as failures to perform true clones are logged as warnings.
     * @param {boolean} options.prioritizePerformance 
     * Normally, the algorithm uses many mechanisms to robustly determine
     * whether objects were created by native class constructors. However, this
     * has some effect on performance. Setting this property to `true` will make
     * the type-checking slightly less robust for the sake of speed.
     * @param {boolean} options.ignoreCloningMethods 
     * If true, cloning methods asociated with an object will not be used to
     * clone the object.
     * @param {boolean} options.letCustomizerThrow 
     * If `true`, errors thrown by the customizer or a cloning method will be
     * thrown by `cloneDeep`. By default, the error is logged and the algorithm
     * proceeds with default behavior.
     * @returns {U} 
     * The deep copy.
     */
    export function cloneDeepAsync<T, U = T>(
        value: T, 
        options?: CloneDeepOptions
    ) : Promise<{ clone: U }>;

    /**
     * Deeply clones the provided object and its prototype chain.
     * 
     * @template T
     * The type of the input value.
     * @template [U = T]
     * The type of the return value. By default, it is the same as the input
     * value. Strictly speaking, the return value can be distinct from the input
     * if an unsupported type is provided or if a customizer or cloning method
     * radically affects the behavior of the algorithm. Use this type variable
     * if you know what you are doing.
     * 
     * @param {any} value 
     * The object to clone.
     * @param {object} [options] 
     * @param {boolean} options.force 
     * If `true`, prototypes with methods will be cloned. Normally, this
     * function stops if it reaches any prototype with methods.
     * @param {Customizer} options.customizer 
     * Allows the user to inject custom logic. The function is given the value
     * to copy. If the function returns an object, the value of the `clone`
     * property on that object will be used as the clone.
     * @param {Log} options.log 
     * Any errors which occur during the algorithm can optionally be passed to a
     * log function. `log` should take one argument which will be the error
     * encountered. Use this to the log the error to a custom logger.
     * @param {string} options.logMode 
     * Case-insensitive. If "silent", no warnings will be logged. Use with
     * caution, as failures to perform true clones are logged as warnings.
     * @param {boolean} options.prioritizePerformance 
     * Normally, the algorithm uses many mechanisms to robustly determine
     * whether objects were created by native class constructors. However, this
     * has some effect on performance. Setting this property to `true` will make
     * the type-checking slightly less robust for the sake of speed.
     * @param {boolean} options.ignoreCloningMethods 
     * If true, cloning methods asociated with an object will not be used to
     * clone the object.
     * @param {boolean} options.letCustomizerThrow 
     * If `true`, errors thrown by the customizer or a cloning method will be
     * thrown by `cloneDeep`. By default, the error is logged and the algorithm
     * proceeds with default behavior.
     * @returns {U} 
     * The deep copy.
     */
    export function cloneDeepFully<T, U = T>(
        value: T,
        options?: CloneDeepFullyOptions
    ) : U;

    /**
     * Deeply clones the provided object and its prototype chain.
     * 
     * @example
     * ```
     * import { cloneDeepFullyAsync } from 'cms-clone-deep';
     * 
     * const { clone } = await cloneDeep(value);
     * ```
     * 
     * @template T
     * The type of the input value.
     * @template [U = T]
     * The type of the return value. By default, it is the same as the input
     * value. Strictly speaking, the return value can be distinct from the input
     * if an unsupported type is provided or if a customizer or cloning method
     * radically affects the behavior of the algorithm. Use this type variable
     * if you know what you are doing.
     * 
     * @param {any} value 
     * The object to clone.
     * @param {object} [options] 
     * @param {boolean} options.force 
     * If `true`, prototypes with methods will be cloned. Normally, this
     * function stops if it reaches any prototype with methods.
     * @param {Customizer} options.customizer 
     * Allows the user to inject custom logic. The function is given the value
     * to copy. If the function returns an object, the value of the `clone`
     * property on that object will be used as the clone.
     * @param {Log} options.log 
     * Any errors which occur during the algorithm can optionally be passed to a
     * log function. `log` should take one argument which will be the error
     * encountered. Use this to the log the error to a custom logger.
     * @param {string} options.logMode 
     * Case-insensitive. If "silent", no warnings will be logged. Use with
     * caution, as failures to perform true clones are logged as warnings.
     * @param {boolean} options.prioritizePerformance 
     * Normally, the algorithm uses many mechanisms to robustly determine
     * whether objects were created by native class constructors. However, this
     * has some effect on performance. Setting this property to `true` will make
     * the type-checking slightly less robust for the sake of speed.
     * @param {boolean} options.ignoreCloningMethods 
     * If true, cloning methods asociated with an object will not be used to
     * clone the object.
     * @param {boolean} options.letCustomizerThrow 
     * If `true`, errors thrown by the customizer or a cloning method will be
     * thrown by `cloneDeep`. By default, the error is logged and the algorithm
     * proceeds with default behavior.
     * @returns {Promise<{ clone: U }>} 
     * The deep copy.
     */
    export function cloneDeepFullyAsync<T, U = T>(
        value: T,
        options?: CloneDeepFullyOptions
    ) : Promise<{ clone: U }>;

    /**
     * Creates a customizer which composes other customizers.
     * The customizers are executed in order. The first to return an object is
     * used as the result. If no customizer returns an object, undefined is
     * returned.
     * @param {Customizer[]} customizers 
     * An array of customizer functions.
     * @returns {Customizer} 
     * A new customizer which composes the provided customizers.
     */
    export function useCustomizers(customizers: Customizer[]) : Customizer;

    /** 
     * Object methods defined with this symbol are used as cloning methods.
     */
    export const CLONE: symbol;
}

export type { AdditionalValue, CloneDeepFullyOptions, CloneDeepOptions, CloningMethodResult, Customizer };
