import { 
    Customizer, 
    CloneDeepOptions, 
    CloneDeepFullyOptions
} from "./src/types";

export { 
    Customizer, 
    CloneDeepOptions, 
    CloneDeepFullyOptions
} from "./src/types";

export { 
    AdditionalValue, 
    CloningMethodResult 
} from "./src/utils/types";

declare module "cms-clone-deep" {

    /**
     * Create a deep copy of the provided value.
     * The cloned object will point to the *same prototype* as the original.
     * 
     * @template T
     * The type of the input value.
     * @template [U = T]
     * The type of the return value. By default, it is the same as the input
     * value. However, exotic customizer or cloning method usage could require
     * them to be distinct.
     * 
     * @param {T} value The value to deeply copy.
     * @param {CloneDeepOptions|Customizer} [optionsOrCustomizer] 
     * If a function, this argument is used as the customizer.
     * @param {object} [optionsOrCustomizer] 
     * If an object, this argument is used as a configuration object.
     * @param {Customizer} optionsOrCustomizer.customizer 
     * Allows the user to inject custom logic. The function is given the value
     * to copy. If the function returns an object, the value of the `clone`
     * property on that object will be used as the clone.
     * @param {Log} optionsOrCustomizer.log 
     * Any errors which occur during the algorithm can optionally be passed to a
     * log function. `log` should take one argument which will be the error
     * encountered. Use this to the log the error to a custom logger.
     * @param {string} optionsOrCustomizer.logMode 
     * Case-insensitive. If "silent", no warnings will be logged. Use with
     * caution, as failures to perform true clones are logged as warnings. If
     * "quiet", the stack trace of the warning is ignored.
     * @param {boolean} optionsOrCustomizer.prioritizePerformance 
     * Normally, the algorithm uses many mechanisms to robustly determine
     * whether objects were created by native class constructors. However, this
     * has some effect on performance. Setting this property to `true` will make
     * the type-checking slightly less robust for the sake of speed.
     * @param {boolean} optionsOrCustomizer.ignoreCloningMethods 
     * If true, cloning methods asociated with an object will not be used to
     * clone the object.
     * @param {boolean} optionsOrCustomizer.letCustomizerThrow 
     * If `true`, errors thrown by the customizer will be thrown by `cloneDeep`.
     * By default, the error is logged and the algorithm proceeds with default
     * behavior.
     * @param {boolean} optionsOrCustomizer.async
     * If `true`, the function will return a promise containing the cloned
     * value.
     * @returns {U | Promise<{ clone: U }>} 
     * The deep copy.
     */
    export default function cloneDeep<T, U = T>(
        value: T, 
        optionsOrCustomizer: CloneDeepOptions|Customizer|undefined
    ) : U | Promise<{ clone: U }>;
        
    /**
     * Deeply clones the provided object and its prototype chain.
     * 
     * @template T
     * The type of the input value.
     * @template [U = T]
     * The type of the return value. By default, it is the same as the input
     * value. However, exotic customizer or cloning method usage could require
     * them to be distinct.
     * 
     * @param {any} value 
     * The object to clone.
     * @param {CloneDeepFullyOptions|Customizer} [optionsOrCustomizer] 
     * If a function, it is used as the customizer for the clone. 
     * @param {object} [optionsOrCustomizer] 
     * If an object, it is used as a configuration object. See the documentation for 
     * `cloneDeep`.
     * @param {boolean} options.force 
     * If `true`, prototypes with methods will be cloned. Normally, this
     * function stops if it reaches any prototype with methods.
     * @param {Customizer} options.customizer 
     * See the documentation for `cloneDeep`.
     * @param {Log} options.log 
     * See the documentation for `cloneDeep`.
     * @param {string} options.logMode 
     * See the documentation for `cloneDeep`.
     * @param {boolean} options.prioritizePerformance 
     * See the documentation for `cloneDeep`.
     * @param {boolean} optionsOrCustomizer.ignoreCloningMethods 
     * See the documentation for `cloneDeep`.
     * @param {boolean} options.letCustomizerThrow 
     * See the documentation for `cloneDeep`.
     * @param {boolean} options.async
     * See the documentation for `cloneDeep`.
     * @returns {U | Promise<{ clone: U }>} 
     * The deep copy.
     */
    export function cloneDeepFully<T, U = T>(
        value: T,
        optionsOrCustomizer: CloneDeepFullyOptions|Customizer|undefined
    ) : U | Promise<{ clone: U }>;

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
    export function useCustomizer(customizers: Customizer[]) : Customizer;
}
